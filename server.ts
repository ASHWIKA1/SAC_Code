import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';
import fs from 'fs';
import multer from 'multer';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

let pool: mysql.Pool;

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

async function initDB() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };
  const dbName = process.env.DB_NAME || 'rfid_attendance';

  const connection = await mysql.createConnection(dbConfig);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();

  pool = mysql.createPool({
    ...dbConfig,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS institutions (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      types JSON,
      createdAt DATETIME
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS branches (
      id VARCHAR(255) PRIMARY KEY,
      institutionId VARCHAR(255),
      name VARCHAR(255),
      type VARCHAR(50),
      entryTime VARCHAR(50),
      exitTime VARCHAR(50),
      createdAt DATETIME
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(255) PRIMARY KEY,
      branchId VARCHAR(255),
      rfidUid VARCHAR(255),
      photoUrl VARCHAR(255),
      dynamic_data JSON,
      createdAt DATETIME,
      updatedAt DATETIME
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(255) PRIMARY KEY,
      institutionId VARCHAR(255),
      branchId VARCHAR(255),
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      role VARCHAR(50),
      password VARCHAR(255)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id VARCHAR(255) PRIMARY KEY,
      studentId VARCHAR(255),
      branchId VARCHAR(255),
      deviceId VARCHAR(255),
      deviceName VARCHAR(255),
      deviceIp VARCHAR(255),
      timestamp DATETIME,
      type VARCHAR(50),
      status VARCHAR(50)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS unknown_scans (
      id VARCHAR(255) PRIMARY KEY,
      rfidUid VARCHAR(255),
      branchId VARCHAR(255),
      timestamp DATETIME
    )
  `);

  await pool.query('DROP TABLE IF EXISTS device_sessions');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS device_sessions (
      id VARCHAR(255) PRIMARY KEY,
      branchId VARCHAR(255),
      deviceName VARCHAR(255),
      ipAddress VARCHAR(255),
      os VARCHAR(255),
      loginTime DATETIME
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      setting_key VARCHAR(255) PRIMARY KEY,
      setting_value JSON
    )
  `);

  try { await pool.query('ALTER TABLE branches ADD COLUMN allowCombinedKiosk BOOLEAN DEFAULT false'); } catch(e) {}
  try { await pool.query('ALTER TABLE branches ADD COLUMN studentEntryTime VARCHAR(50)'); } catch(e) {}
  try { await pool.query('ALTER TABLE branches ADD COLUMN studentExitTime VARCHAR(50)'); } catch(e) {}
  try { await pool.query('ALTER TABLE branches ADD COLUMN staffEntryTime VARCHAR(50)'); } catch(e) {}
  try { await pool.query('ALTER TABLE branches ADD COLUMN staffExitTime VARCHAR(50)'); } catch(e) {}
  try { await pool.query('ALTER TABLE branches ADD COLUMN requireExitScan BOOLEAN DEFAULT false'); } catch(e) {}
  try { await pool.query('ALTER TABLE students ADD COLUMN memberType VARCHAR(50) DEFAULT "Student"'); } catch(e) {}
  try { await pool.query('ALTER TABLE admins ADD COLUMN kioskType VARCHAR(50) DEFAULT "Combined"'); } catch(e) {}

  const [adminRows] = await pool.query('SELECT * FROM admins WHERE email = ?', ['itsupport@technosprint.net']);
  if ((adminRows as any[]).length === 0) {
    await pool.query(
      'INSERT INTO admins (id, institutionId, branchId, name, email, role, password, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), null, null, 'IT Support', 'itsupport@technosprint.net', 'Ultra Admin', 'password', 'Combined']
    );
  }

  // Also add gotek@gmail.com if missing
  const [gotekRows] = await pool.query('SELECT * FROM admins WHERE email = ?', ['gotek@gmail.com']);
  if ((gotekRows as any[]).length === 0) {
    await pool.query(
      'INSERT INTO admins (id, institutionId, branchId, name, email, role, password, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuidv4(), null, null, 'Gotek Admin', 'gotek@gmail.com', 'Ultra Admin', 'gotek123', 'Combined']
    );
  }
}

async function startServer() {
  await initDB();

  const app = express();
  app.set('trust proxy', true);
  app.use(express.json());
  app.use('/uploads', express.static(uploadDir));

  // == REST APIs ==

  app.post('/api/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password, deviceName } = req.body;
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? AND password = ?', [email, password]);
    const admins = rows as any[];
    if (admins.length > 0) {
      const { password, ...userWithoutPassword } = admins[0];
      
      if (userWithoutPassword.role === 'User') {
        const sessionId = uuidv4();
        const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'Unknown';
        let os = 'Unknown OS';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac OS')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

        await pool.query(
          'INSERT INTO device_sessions (id, branchId, deviceName, ipAddress, os, loginTime) VALUES (?, ?, ?, ?, ?, ?)',
          [sessionId, userWithoutPassword.branchId, deviceName || 'Scanner', ipAddress, os, new Date()]
        );
        userWithoutPassword.sessionId = sessionId;
        userWithoutPassword.deviceName = deviceName || 'Scanner';
      }

      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });

  // --- Institutions ---
  app.get('/api/institutions', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM institutions');
    res.json(rows);
  });
  
  app.post('/api/institutions', async (req, res) => {
    try {
      const { name, types, superAdminName, email, password } = req.body;
      const id = uuidv4();
      await pool.query(
        'INSERT INTO institutions (id, name, types, createdAt) VALUES (?, ?, ?, ?)',
        [id, name, JSON.stringify(types), new Date()]
      );

      // Auto-create a Super Admin account for this institution
      if (email && password) {
        const [existing] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        if ((existing as any[]).length > 0) {
          res.status(400).json({ error: 'This email is already in use by another account.' });
          return;
        }
        const adminId = uuidv4();
        await pool.query(
          'INSERT INTO admins (id, institutionId, branchId, name, email, password, role, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [adminId, id, null, superAdminName || name + ' Admin', email, password, 'Super Admin', 'Combined']
        );
      }

      res.status(201).json({ id, name, types });
    } catch (err: any) {
      console.error('POST /api/institutions error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  app.put('/api/institutions/:id', async (req, res) => {
    try {
      const { name, types, superAdminName, email, password } = req.body;
      const instId = req.params.id;
      
      await pool.query(
        'UPDATE institutions SET name = ?, types = ? WHERE id = ?',
        [name, JSON.stringify(types), instId]
      );

      // Update the Super Admin linked to this institution
      if (email) {
        const [existingAdmins] = await pool.query(
          'SELECT * FROM admins WHERE institutionId = ? AND role = ? LIMIT 1',
          [instId, 'Super Admin']
        );
        if ((existingAdmins as any[]).length > 0) {
          const existing = (existingAdmins as any)[0];
          
          // Check if the new email conflicts with a DIFFERENT admin
          const [emailConflict] = await pool.query(
            'SELECT * FROM admins WHERE email = ? AND id != ?', [email, existing.id]
          );
          if ((emailConflict as any[]).length > 0) {
            res.status(400).json({ error: 'This email is already used by another account.' });
            return;
          }

          let updateQuery = 'UPDATE admins SET name = ?, email = ?';
          const updateParams: any[] = [superAdminName || name + ' Admin', email];
          if (password && password.trim() !== '') {
            updateQuery += ', password = ?';
            updateParams.push(password);
          }
          updateQuery += ' WHERE id = ?';
          updateParams.push(existing.id);
          await pool.query(updateQuery, updateParams);
        } else {
          // Check if email is already taken
          const [emailConflict] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
          if ((emailConflict as any[]).length > 0) {
            res.status(400).json({ error: 'This email is already used by another account.' });
            return;
          }
          const adminId = uuidv4();
          await pool.query(
            'INSERT INTO admins (id, institutionId, branchId, name, email, password, role, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [adminId, instId, null, superAdminName || name + ' Admin', email, password || 'changeme', 'Super Admin', 'Combined']
          );
        }
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error('PUT /api/institutions/:id error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  app.delete('/api/institutions/:id', async (req, res) => {
    // Also delete the linked Super Admin
    await pool.query('DELETE FROM admins WHERE institutionId = ? AND role = ?', [req.params.id, 'Super Admin']);
    await pool.query('DELETE FROM institutions WHERE id = ?', [req.params.id]);
    res.status(204).send();
  });

  // --- Branches ---
  app.get('/api/branches', async (req, res) => {
    const { institutionId } = req.query;
    let query = 'SELECT * FROM branches';
    const params: any[] = [];
    if (institutionId) {
      query += ' WHERE institutionId = ?';
      params.push(institutionId);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  });

  app.post('/api/branches', async (req, res) => {
    const { 
      institutionId, name, type, 
      entryTime, exitTime, allowCombinedKiosk,
      studentEntryTime, studentExitTime, staffEntryTime, staffExitTime, requireExitScan
    } = req.body;
    const id = uuidv4();
    await pool.query(
      `INSERT INTO branches (
        id, institutionId, name, type, entryTime, exitTime, allowCombinedKiosk,
        studentEntryTime, studentExitTime, staffEntryTime, staffExitTime, requireExitScan,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, institutionId, name, type, entryTime, exitTime, allowCombinedKiosk ? 1 : 0,
        studentEntryTime, studentExitTime, staffEntryTime, staffExitTime, requireExitScan ? 1 : 0,
        new Date()
      ]
    );
    res.status(201).json({ id });
  });

  app.put('/api/branches/:id', async (req, res) => {
    const { 
      name, type, 
      entryTime, exitTime, allowCombinedKiosk,
      studentEntryTime, studentExitTime, staffEntryTime, staffExitTime, requireExitScan
    } = req.body;
    await pool.query(
      `UPDATE branches SET 
        name = ?, type = ?, entryTime = ?, exitTime = ?, allowCombinedKiosk = ?,
        studentEntryTime = ?, studentExitTime = ?, staffEntryTime = ?, staffExitTime = ?, requireExitScan = ?
      WHERE id = ?`,
      [
        name, type, entryTime, exitTime, allowCombinedKiosk ? 1 : 0,
        studentEntryTime, studentExitTime, staffEntryTime, staffExitTime, requireExitScan ? 1 : 0,
        req.params.id
      ]
    );
    res.json({ success: true });
  });

  app.delete('/api/branches/:id', async (req, res) => {
    await pool.query('DELETE FROM branches WHERE id = ?', [req.params.id]);
    res.status(204).send();
  });

  // --- Admins ---
  app.get('/api/admins', async (req, res) => {
    const { institutionId, branchId } = req.query;
    let query = 'SELECT id, institutionId, branchId, name, email, role, kioskType FROM admins WHERE 1=1';
    const params: any[] = [];
    if (institutionId) { query += ' AND institutionId = ?'; params.push(institutionId); }
    if (branchId) { query += ' AND branchId = ?'; params.push(branchId); }
    
    const [rows] = await pool.query(query, params);
    res.json(rows);
  });

  app.post('/api/admins', async (req, res) => {
    const { name, email, password, role, institutionId, branchId, kioskType } = req.body;
    const [existing] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    const newAdmin = { id: uuidv4(), institutionId: institutionId || null, branchId: branchId || null, name, email, password, role, kioskType: kioskType || 'Combined' };
    await pool.query(
      'INSERT INTO admins (id, institutionId, branchId, name, email, password, role, kioskType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newAdmin.id, newAdmin.institutionId, newAdmin.branchId, newAdmin.name, newAdmin.email, newAdmin.password, newAdmin.role, newAdmin.kioskType]
    );
    const { password: _, ...safeAdmin } = newAdmin;
    res.status(201).json(safeAdmin);
  });

  app.delete('/api/admins/:id', async (req, res) => {
    await pool.query('DELETE FROM admins WHERE id = ?', [req.params.id]);
    res.status(204).send();
  });

  // --- Stats ---
  app.get('/api/stats', async (req, res) => {
    const { branchId, institutionId } = req.query;
    const today = new Date().toISOString().split('T')[0];
    
    let studentQuery = 'SELECT COUNT(*) as count FROM students';
    let attQuery = 'SELECT studentId, status FROM attendance WHERE DATE(timestamp) = ?';
    let unkQuery = 'SELECT COUNT(*) as count FROM unknown_scans';
    let devQuery = 'SELECT COUNT(DISTINCT deviceId) as count FROM attendance WHERE DATE(timestamp) = ?';
    
    const sParams: any[] = [];
    const aParams: any[] = [today];
    const uParams: any[] = [];
    const dParams: any[] = [today];

    if (branchId) {
      studentQuery += ' WHERE branchId = ?'; sParams.push(branchId);
      attQuery += ' AND branchId = ?'; aParams.push(branchId);
      unkQuery += ' WHERE branchId = ?'; uParams.push(branchId);
      devQuery += ' AND branchId = ?'; dParams.push(branchId);
    } else if (institutionId) {
      const instFilter = ' IN (SELECT id FROM branches WHERE institutionId = ?)';
      studentQuery += ' WHERE branchId' + instFilter; sParams.push(institutionId);
      attQuery += ' AND branchId' + instFilter; aParams.push(institutionId);
      unkQuery += ' WHERE branchId' + instFilter; uParams.push(institutionId);
      devQuery += ' AND branchId' + instFilter; dParams.push(institutionId);
    }

    const [studentRows] = await pool.query(studentQuery, sParams);
    const totalStudents = (studentRows as any)[0].count;

    const [attendanceRows] = await pool.query(attQuery, aParams);
    const attendanceLogs = attendanceRows as any[];
    
    const presentCount = new Set(attendanceLogs.map(l => l.studentId)).size;
    const lateCount = attendanceLogs.filter(l => l.status === 'LATE').length;
    
    const [unknownRows] = await pool.query(unkQuery, uParams);
    const [devRows] = await pool.query(devQuery, dParams);
    
    res.json({
      totalStudents,
      presentToday: presentCount,
      absentToday: Math.max(0, totalStudents - presentCount),
      lateStudents: lateCount,
      unknownScans: (unknownRows as any)[0].count,
      activeDevices: (devRows as any)[0].count, 
    });
  });

  // --- Analytics ---
  app.get('/api/analytics/overall', async (req, res) => {
    const { institutionId, dateFrom, dateTo, memberType } = req.query;
    if (!institutionId) return res.status(400).json({ error: 'institutionId required' });

    let branchCondition = 'IN (SELECT id FROM branches WHERE institutionId = ?)';
    let params: any[] = [institutionId];
    
    let dateFilter = '';
    let attParams: any[] = [];
    if (dateFrom && dateTo) {
      dateFilter = ' AND DATE(timestamp) >= ? AND DATE(timestamp) <= ?';
      attParams.push(dateFrom, dateTo);
    }
    
    let memberFilter = '';
    let memParams: any[] = [];
    if (memberType && memberType !== 'Combined') {
      memberFilter = ' AND memberType = ?';
      memParams.push(memberType);
    }

    const [students] = await pool.query(`SELECT id, memberType FROM students WHERE branchId ${branchCondition} ${memberFilter}`, [...params, ...memParams]);
    const totalStudents = (students as any[]).filter(s => s.memberType === 'Student').length;
    const totalStaff = (students as any[]).filter(s => s.memberType === 'Staff').length;

    const [attendance] = await pool.query(`
      SELECT studentId, type, status, DATE(timestamp) as date 
      FROM attendance 
      WHERE branchId ${branchCondition} ${dateFilter}
    `, [...params, ...attParams]);
    
    const attList = attendance as any[];
    const presenceMap = new Map();
    attList.forEach(a => {
      if (a.type === 'ENTRY') {
        const key = `${a.studentId}_${a.date}`;
        if (!presenceMap.has(key)) {
          presenceMap.set(key, { studentId: a.studentId, date: a.date, isLate: a.status === 'LATE' });
        }
      }
    });
    
    let presentStudents = 0;
    let lateStudents = 0;
    let presentStaff = 0;
    let lateStaff = 0;
    
    const studentIds = new Set((students as any[]).filter(s => s.memberType === 'Student').map(s => s.id));
    const staffIds = new Set((students as any[]).filter(s => s.memberType === 'Staff').map(s => s.id));
    
    presenceMap.forEach(val => {
      if (studentIds.has(val.studentId)) {
        presentStudents++;
        if (val.isLate) lateStudents++;
      } else if (staffIds.has(val.studentId)) {
        presentStaff++;
        if (val.isLate) lateStaff++;
      }
    });
    
    let numDays = 1;
    if (dateFrom && dateTo) {
      const d1 = new Date(dateFrom as string);
      const d2 = new Date(dateTo as string);
      numDays = Math.max(1, Math.floor((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1);
    }
    
    const absentStudents = Math.max(0, (totalStudents * numDays) - presentStudents);
    const absentStaff = Math.max(0, (totalStaff * numDays) - presentStaff);
    
    const [branches] = await pool.query(`SELECT COUNT(*) as count FROM branches WHERE institutionId = ?`, [institutionId]);
    const totalBranches = (branches as any)[0].count;
    
    res.json({
      totalBranches,
      students: { total: totalStudents, present: presentStudents, absent: absentStudents, late: lateStudents },
      staff: { total: totalStaff, present: presentStaff, absent: absentStaff, late: lateStaff },
    });
  });

  app.get('/api/analytics/specific', async (req, res) => {
    const { institutionId, branchId, dateFrom, dateTo, memberType } = req.query;
    if (!institutionId) return res.status(400).json({ error: 'institutionId required' });

    let bFilter = 'institutionId = ?';
    let bParams: any[] = [institutionId];
    if (branchId) {
       bFilter += ' AND id = ?';
       bParams.push(branchId);
    }

    const [branches] = await pool.query(`SELECT id, name, type FROM branches WHERE ${bFilter}`, bParams);
    
    let dateFilter = '';
    let attParams: any[] = [];
    if (dateFrom && dateTo) {
      dateFilter = ' AND DATE(timestamp) >= ? AND DATE(timestamp) <= ?';
      attParams.push(dateFrom, dateTo);
    }
    
    let memberFilter = '';
    let memParams: any[] = [];
    if (memberType && memberType !== 'Combined') {
      memberFilter = ' AND memberType = ?';
      memParams.push(memberType);
    }
    
    let numDays = 1;
    if (dateFrom && dateTo) {
      const d1 = new Date(dateFrom as string);
      const d2 = new Date(dateTo as string);
      numDays = Math.max(1, Math.floor((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1);
    }

    const results = [];
    for (const branch of branches as any[]) {
       const [students] = await pool.query(`SELECT id, memberType FROM students WHERE branchId = ? ${memberFilter}`, [branch.id, ...memParams]);
       const totalStudents = (students as any[]).filter(s => s.memberType === 'Student').length;
       const totalStaff = (students as any[]).filter(s => s.memberType === 'Staff').length;
       
       const [attendance] = await pool.query(`
         SELECT studentId, type, status, DATE(timestamp) as date 
         FROM attendance 
         WHERE branchId = ? ${dateFilter}
       `, [branch.id, ...attParams]);
       
       const presenceMap = new Map();
       (attendance as any[]).forEach(a => {
         if (a.type === 'ENTRY') {
           const key = `${a.studentId}_${a.date}`;
           if (!presenceMap.has(key)) presenceMap.set(key, { studentId: a.studentId, isLate: a.status === 'LATE' });
         }
       });
       
       let presentStudents = 0, lateStudents = 0, presentStaff = 0, lateStaff = 0;
       const studentIds = new Set((students as any[]).filter(s => s.memberType === 'Student').map(s => s.id));
       const staffIds = new Set((students as any[]).filter(s => s.memberType === 'Staff').map(s => s.id));
       
       presenceMap.forEach(val => {
         if (studentIds.has(val.studentId)) { presentStudents++; if (val.isLate) lateStudents++; }
         else if (staffIds.has(val.studentId)) { presentStaff++; if (val.isLate) lateStaff++; }
       });
       
       results.push({
         branch: { id: branch.id, name: branch.name, type: branch.type },
         students: { total: totalStudents, present: presentStudents, absent: Math.max(0, (totalStudents * numDays) - presentStudents), late: lateStudents },
         staff: { total: totalStaff, present: presentStaff, absent: Math.max(0, (totalStaff * numDays) - presentStaff), late: lateStaff }
       });
    }

    res.json(results);
  });

  app.get('/api/analytics/individual/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { institutionId, dateFrom, dateTo } = req.query;

    if (!institutionId) {
      return res.status(400).json({ error: 'institutionId required' });
    }

    try {
      // 1. Fetch Student Info
      const [studentRows] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
      if ((studentRows as any[]).length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      const studentRow = (studentRows as any)[0];
      const data = typeof studentRow.dynamic_data === 'string' ? JSON.parse(studentRow.dynamic_data) : studentRow.dynamic_data;
      const student = {
        id: studentRow.id,
        branchId: studentRow.branchId,
        rfidUid: studentRow.rfidUid,
        photoUrl: studentRow.photoUrl,
        memberType: studentRow.memberType || 'Student',
        ...data
      };

      // Ensure branch belongs to institution if needed, or RBAC check is done via branchId
      const [branchRows] = await pool.query('SELECT id, name FROM branches WHERE id = ? AND institutionId = ?', [student.branchId, institutionId]);
      if ((branchRows as any[]).length === 0) {
        return res.status(403).json({ error: 'Access denied to this student\'s records' });
      }

      // 2. Fetch Attendance History
      let query = 'SELECT * FROM attendance WHERE studentId = ?';
      const params: any[] = [studentId];

      if (dateFrom && dateTo) {
        query += ' AND DATE(timestamp) >= ? AND DATE(timestamp) <= ?';
        params.push(dateFrom, dateTo);
      }
      
      query += ' ORDER BY timestamp DESC';

      const [attendanceRows] = await pool.query(query, params);
      const attendance = attendanceRows as any[];

      // 3. Calculate Summary
      let presentDays = new Set();
      let lateDays = new Set();
      
      attendance.forEach(record => {
        if (record.type === 'ENTRY') {
          const dateStr = new Date(record.timestamp).toISOString().split('T')[0];
          presentDays.add(dateStr);
          if (record.status === 'LATE') {
            lateDays.add(dateStr);
          }
        }
      });

      res.json({
        student,
        branch: (branchRows as any)[0],
        summary: {
          totalPresent: presentDays.size,
          totalLate: lateDays.size
        },
        history: attendance
      });
    } catch (err: any) {
      console.error('GET /api/analytics/individual error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/students', async (req, res) => {
    const { branchId, institutionId } = req.query;
    let query = 'SELECT * FROM students WHERE 1=1';
    const params: any[] = [];
    
    if (branchId) {
      query += ' AND branchId = ?';
      params.push(branchId);
    } else if (institutionId) {
      query += ' AND branchId IN (SELECT id FROM branches WHERE institutionId = ?)';
      params.push(institutionId);
    }

    const [rows] = await pool.query(query, params);
    const students = (rows as any[]).map(row => {
      const data = typeof row.dynamic_data === 'string' ? JSON.parse(row.dynamic_data) : row.dynamic_data;
      return {
        id: row.id,
        branchId: row.branchId,
        rfidUid: row.rfidUid,
        photoUrl: row.photoUrl,
        memberType: row.memberType || 'Student',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        ...(data || {})
      };
    });
    res.json(students);
  });

  app.post('/api/students', async (req, res) => {
    const { id, branchId, rfidUid, photoUrl, createdAt, updatedAt, memberType, ...dynamicData } = req.body;
    const newStudent = {
      id: id || uuidv4(),
      branchId: branchId || null,
      rfidUid: rfidUid || '',
      photoUrl: photoUrl || '',
      memberType: memberType || 'Student',
      dynamic_data: JSON.stringify(dynamicData),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await pool.query(
      'INSERT INTO students (id, branchId, rfidUid, photoUrl, memberType, dynamic_data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [newStudent.id, newStudent.branchId, newStudent.rfidUid, newStudent.photoUrl, newStudent.memberType, newStudent.dynamic_data, newStudent.createdAt, newStudent.updatedAt]
    );
    res.status(201).json({ id: newStudent.id, branchId: newStudent.branchId, ...dynamicData });
  });

  app.delete('/api/students/:id', async (req, res) => {
    await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.status(204).send();
  });

  app.put('/api/students/:id', async (req, res) => {
    const { id, branchId, rfidUid, photoUrl, createdAt, updatedAt, memberType, ...dynamicData } = req.body;
    
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if ((rows as any[]).length === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    const current = (rows as any)[0];
    const newDynamicData = { ...(typeof current.dynamic_data === 'string' ? JSON.parse(current.dynamic_data) : current.dynamic_data), ...dynamicData };

    await pool.query(
      'UPDATE students SET branchId = IFNULL(?, branchId), memberType = IFNULL(?, memberType), dynamic_data = ?, updatedAt = ? WHERE id = ?',
      [branchId || null, memberType || null, JSON.stringify(newDynamicData), new Date(), req.params.id]
    );
    res.json({ success: true });
  });

  app.post('/api/students/:id/rfid', async (req, res) => {
    const { rfidUid } = req.body;
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if ((rows as any[]).length === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    
    const [existing] = await pool.query('SELECT * FROM students WHERE rfidUid = ? AND id != ?', [rfidUid, req.params.id]);
    if ((existing as any[]).length > 0) {
      res.status(400).json({ error: 'RFID tag already assigned to another student' });
      return;
    }

    await pool.query('UPDATE students SET rfidUid = ?, updatedAt = ? WHERE id = ?', [rfidUid, new Date(), req.params.id]);
    res.json({ success: true });
  });

  app.get('/api/devices', async (req, res) => {
    const { branchId } = req.query;
    if (branchId) {
      const [rows] = await pool.query('SELECT * FROM device_sessions WHERE branchId = ?', [branchId]);
      res.json(rows);
    } else {
      res.json([]);
    }
  });

  // --- Attendance & Scanning ---
  app.post('/api/rfid/scan', async (req, res) => {
    const { rfidUid, sessionId, deviceName, kioskType } = req.body;
    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';

    const [rows] = await pool.query('SELECT * FROM students WHERE rfidUid = ?', [rfidUid]);
    
    if ((rows as any[]).length > 0) {
      const studentRow = (rows as any)[0];
      const memberType = studentRow.memberType || 'Student';
      
      if (kioskType === 'Student' && memberType !== 'Student') {
        res.status(403).json({ success: false, error: 'This terminal is for Students only.' });
        return;
      }
      if (kioskType === 'Staff' && memberType !== 'Staff') {
        res.status(403).json({ success: false, error: 'This terminal is for Staff only.' });
        return;
      }

      const data = typeof studentRow.dynamic_data === 'string' ? JSON.parse(studentRow.dynamic_data) : studentRow.dynamic_data;
      const student = { id: studentRow.id, rfidUid: studentRow.rfidUid, photoUrl: studentRow.photoUrl, memberType, ...data };
      
      let branchId = studentRow.branchId;
      let branch: any = null;

      if (branchId) {
        const [branchRows] = await pool.query('SELECT * FROM branches WHERE id = ?', [branchId]);
        if ((branchRows as any[]).length > 0) {
          branch = (branchRows as any)[0];
        }
      }

      // Check last attendance today
      const [lastLogs] = await pool.query(
        'SELECT type, timestamp FROM attendance WHERE studentId = ? AND DATE(timestamp) = CURDATE() ORDER BY timestamp DESC LIMIT 1',
        [studentRow.id]
      );
      
      let nextType = 'ENTRY';
      const now = new Date();

      if ((lastLogs as any[]).length > 0) {
        const lastLog = (lastLogs as any)[0];
        const lastTime = new Date(lastLog.timestamp);
        const diffMinutes = (now.getTime() - lastTime.getTime()) / 60000;

        if (lastLog.type === 'ENTRY') {
          if (diffMinutes < 30) {
            res.status(429).json({ success: false, error: 'Already marked as Present.', state: 'COOLDOWN_ENTRY' });
            return;
          } else {
            // Check if Exit scan is required by the branch settings
            if (branch && branch.requireExitScan === 0 && false) { // Assuming we still log EXIT regardless, or what? The prompt says "When enabled, both Students and Teachers must scan their RFID card while leaving...". If disabled, they don't *have* to, but if they do, it still records EXIT.
               // We will record EXIT anyway. 
            }
            nextType = 'EXIT';
          }
        } else if (lastLog.type === 'EXIT') {
          if (diffMinutes < 30) {
            res.status(429).json({ success: false, error: 'You have already exited.', state: 'COOLDOWN_EXIT' });
            return;
          } else {
            nextType = 'ENTRY';
          }
        }
      }

      let status = nextType === 'ENTRY' ? 'PRESENT' : 'LEFT';
      
      if (branch && nextType === 'ENTRY') {
        let entryTimeStr = null;
        if (branch.allowCombinedKiosk) {
          entryTimeStr = branch.entryTime;
        } else {
          entryTimeStr = memberType === 'Staff' ? branch.staffEntryTime : branch.studentEntryTime;
        }

        if (entryTimeStr) {
          const [entryHour, entryMinute] = entryTimeStr.split(':').map(Number);
          const entryTimeObj = new Date(now.getFullYear(), now.getMonth(), now.getDate(), entryHour, entryMinute);
          if (now.getTime() > entryTimeObj.getTime() + 15 * 60000) {
            status = 'LATE';
          }
        }
      }
      
      const log = {
        id: uuidv4(),
        studentId: studentRow.id,
        branchId: branchId,
        deviceId: sessionId || 'unknown',
        deviceName: deviceName || 'Web Scanner',
        deviceIp: ipAddress,
        timestamp: now,
        type: nextType,
        status: status,
      };
      
      await pool.query(
        'INSERT INTO attendance (id, studentId, branchId, deviceId, deviceName, deviceIp, timestamp, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [log.id, log.studentId, log.branchId, log.deviceId, log.deviceName, log.deviceIp, log.timestamp, log.type, log.status]
      );

      res.json({ success: true, student, log });
    } else {
      let branchId = null;
      if (sessionId) {
        const [sessRows] = await pool.query('SELECT branchId FROM device_sessions WHERE id = ?', [sessionId]);
        if ((sessRows as any[]).length > 0) {
          branchId = (sessRows as any)[0].branchId;
        }
      }
      await pool.query(
        'INSERT INTO unknown_scans (id, rfidUid, branchId, timestamp) VALUES (?, ?, ?, ?)',
        [uuidv4(), rfidUid, branchId, new Date()]
      );
      res.status(404).json({ success: false, error: 'RFID Not Registered' });
    }
  });

  app.get('/api/attendance/logs', async (req, res) => {
    const { branchId, institutionId, deviceId } = req.query;
    let query = 'SELECT a.*, s.dynamic_data, s.photoUrl FROM attendance a LEFT JOIN students s ON a.studentId = s.id WHERE 1=1';
    const params: any[] = [];
    
    if (branchId) {
      query += ' AND a.branchId = ?';
      params.push(branchId);
    } else if (institutionId) {
      query += ' AND a.branchId IN (SELECT id FROM branches WHERE institutionId = ?)';
      params.push(institutionId);
    } else if (deviceId) {
      query += ' AND a.deviceId = ?';
      params.push(deviceId);
    }
    
    query += ' ORDER BY a.timestamp DESC LIMIT 50';

    const [rows] = await pool.query(query, params);
    
    const enrichedLogs = (rows as any[]).map(log => {
      const data = typeof log.dynamic_data === 'string' ? JSON.parse(log.dynamic_data) : log.dynamic_data;
      return {
        id: log.id,
        studentId: log.studentId,
        branchId: log.branchId,
        deviceId: log.deviceId,
        deviceName: log.deviceName,
        deviceIp: log.deviceIp,
        timestamp: log.timestamp,
        type: log.type,
        status: log.status,
        student: { id: log.studentId, photoUrl: log.photoUrl, ...(data || {}) }
      };
    });
    res.json(enrichedLogs);
  });

  // Settings Endpoints
  app.get('/api/settings/columns', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = ?', ['excel_columns']);
      if ((rows as any[]).length > 0) {
        res.json((rows as any)[0].setting_value);
      } else {
        res.json(null);
      }
    } catch (err) { res.status(500).json({ error: 'DB Error' }); }
  });

  app.post('/api/settings/columns', async (req, res) => {
    try {
      const { columns, photoColumn } = req.body;
      const val = JSON.stringify({ columns, photoColumn });
      await pool.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        ['excel_columns', val, val]
      );
      res.json({ success: true });
    } catch (err) { res.status(500).json({ error: 'DB Error' }); }
  });

  // == Vite Integration ==
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
