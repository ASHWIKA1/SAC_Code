import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rfid_attendance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function seed() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    console.log('Clearing existing dummy data (keeping ultra admin)...');
    
    // We won't truncate admins to keep ultra admin, just delete dummy ones later
    // Actually we will just wipe everything except Ultra Admin
    await pool.query("DELETE FROM admins WHERE role != 'Ultra Admin'");
    await pool.query("DELETE FROM institutions");
    await pool.query("DELETE FROM branches");
    await pool.query("DELETE FROM students");
    await pool.query("DELETE FROM attendance");

    console.log('Seeding Institutions...');
    const inst1 = uuidv4();
    const inst2 = uuidv4();
    
    await pool.query(`INSERT INTO institutions (id, name, types, createdAt) VALUES (?, ?, ?, ?)`, 
      [inst1, "Global Tech University", JSON.stringify(["University"]), new Date()]);
      
    await pool.query(`INSERT INTO institutions (id, name, types, createdAt) VALUES (?, ?, ?, ?)`, 
      [inst2, "Springfield Public Schools", JSON.stringify(["School"]), new Date()]);

    console.log('Seeding Admins...');
    // Super Admins
    await pool.query(`INSERT INTO admins (id, institutionId, branchId, name, email, role, password, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), inst1, null, "Global Tech Super Admin", "superadmin@globaltech.edu", "Super Admin", "admin@123", "Combined"]);
      
    await pool.query(`INSERT INTO admins (id, institutionId, branchId, name, email, role, password, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), inst2, null, "Springfield Super Admin", "superadmin@springfield.edu", "Super Admin", "admin@123", "Combined"]);

    console.log('Seeding Branches...');
    const b1 = uuidv4(); const b2 = uuidv4(); const b3 = uuidv4();
    
    const branchesData = [
      { id: b1, inst: inst1, name: "Engineering Campus", type: "College" },
      { id: b2, inst: inst1, name: "Medical Campus", type: "College" },
      { id: b3, inst: inst2, name: "High School Branch", type: "School" }
    ];

    for (let i = 0; i < branchesData.length; i++) {
      const b = branchesData[i];
      await pool.query(`INSERT INTO branches (id, institutionId, name, type, allowCombinedKiosk, studentEntryTime, studentExitTime, staffEntryTime, staffExitTime, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.id, b.inst, b.name, b.type, true, "08:00", "16:00", "07:30", "17:00", new Date()]);
        
      // For the first branch, use static friendly demo emails. For others, use random IDs.
      const adminEmail = i === 0 ? 'admin@demo.com' : `admin@${b.id.substring(0,8)}.com`;
      const kioskEmail = i === 0 ? 'kiosk@demo.com' : `kiosk@${b.id.substring(0,8)}.com`;

      await pool.query(`INSERT INTO admins (id, institutionId, branchId, name, email, role, password, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), b.inst, b.id, `${b.name} Admin`, adminEmail, "Admin", "admin@123", "Combined"]);
        
      await pool.query(`INSERT INTO admins (id, institutionId, branchId, name, email, role, password, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), b.inst, b.id, `${b.name} Kiosk`, kioskEmail, "User", "admin@123", "Combined"]);
    }

    console.log('Seeding Students & Staff...');
    const students: any[] = [];
    
    // Helper to get random names
    const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    
    for (const b of branchesData) {
      // 25 students
      for (let i = 0; i < 25; i++) {
        const id = uuidv4();
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fname} ${lname}`;
        
        students.push({ id, branchId: b.id, name, type: "Student" });
        
        await pool.query(`INSERT INTO students (id, branchId, rfidUid, photoUrl, dynamic_data, memberType, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, b.id, `RFID-STU-${b.id.substring(0,4)}-${i}`, `https://ui-avatars.com/api/?name=${fname}+${lname}&background=random`, JSON.stringify({ Name: name, RollNo: `R${i+100}` }), "Student", new Date()]);
      }
      
      // 8 staff
      for (let i = 0; i < 8; i++) {
        const id = uuidv4();
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fname} ${lname}`;
        
        students.push({ id, branchId: b.id, name, type: "Staff" });
        
        await pool.query(`INSERT INTO students (id, branchId, rfidUid, photoUrl, dynamic_data, memberType, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, b.id, `RFID-STF-${b.id.substring(0,4)}-${i}`, `https://ui-avatars.com/api/?name=${fname}+${lname}&background=random`, JSON.stringify({ Name: name, EmployeeID: `E${i+100}` }), "Staff", new Date()]);
      }
    }

    console.log('Seeding Attendance (Past 30 Days)...');
    
    const today = new Date();
    
    for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
      const d = new Date(today);
      d.setDate(d.getDate() - dayOffset);
      
      // Skip Sundays (0) and Saturdays (6)
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      
      for (const s of students) {
        // 5% chance of being absent
        if (Math.random() < 0.05) continue;
        
        // 10% chance of being late
        const isLate = Math.random() < 0.10;
        
        let entryHour = s.type === 'Student' ? 8 : 7;
        let entryMinute = s.type === 'Student' ? 0 : 30;
        
        if (isLate) {
          entryHour += 1; // 1 hour late
        } else {
          // Arrive 5-15 mins early
          entryMinute -= Math.floor(Math.random() * 15) + 5;
          if (entryMinute < 0) {
            entryHour -= 1;
            entryMinute += 60;
          }
        }
        
        const entryTime = new Date(d);
        entryTime.setHours(entryHour, entryMinute, Math.floor(Math.random() * 60));
        
        await pool.query(`INSERT INTO attendance (id, studentId, branchId, deviceId, deviceName, deviceIp, timestamp, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), s.id, s.branchId, "DUMMY-DEV", "Dummy Scanner", "192.168.1.100", entryTime, "ENTRY", isLate ? "LATE" : "PRESENT"]);
          
        // Exit time
        let exitHour = s.type === 'Student' ? 16 : 17;
        let exitMinute = Math.floor(Math.random() * 30); // Leave up to 30 mins after bell
        
        const exitTime = new Date(d);
        exitTime.setHours(exitHour, exitMinute, Math.floor(Math.random() * 60));
        
        await pool.query(`INSERT INTO attendance (id, studentId, branchId, deviceId, deviceName, deviceIp, timestamp, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [uuidv4(), s.id, s.branchId, "DUMMY-DEV", "Dummy Scanner", "192.168.1.100", exitTime, "EXIT", "PRESENT"]);
      }
    }

    console.log('Seeding Complete! 🎉');
    console.log('Super Admin 1: superadmin@globaltech.edu / admin@123');
    console.log('Super Admin 2: superadmin@springfield.edu / admin@123');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seed();
