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
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(255) PRIMARY KEY,
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
      timestamp DATETIME,
      type VARCHAR(50),
      status VARCHAR(50)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS unknown_scans (
      id VARCHAR(255) PRIMARY KEY,
      rfidUid VARCHAR(255),
      timestamp DATETIME
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      setting_key VARCHAR(255) PRIMARY KEY,
      setting_value JSON
    )
  `);

  const [adminRows] = await pool.query('SELECT * FROM admins WHERE email = ?', ['itsupport@technosprint.net']);
  if ((adminRows as any[]).length === 0) {
    await pool.query(
      'INSERT INTO admins (id, name, email, role, password) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), 'IT Support', 'itsupport@technosprint.net', 'Ultra Admin', 'Poland@01']
    );
  }
}

async function startServer() {
  await initDB();

  const app = express();
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
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ? AND password = ?', [email, password]);
    const admins = rows as any[];
    if (admins.length > 0) {
      const { password, ...userWithoutPassword } = admins[0];
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });

  app.get('/api/admins', async (req, res) => {
    const [rows] = await pool.query('SELECT id, name, email, role FROM admins');
    res.json(rows);
  });

  app.post('/api/admins', async (req, res) => {
    const { name, email, password, role } = req.body;
    const [existing] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    const newAdmin = { id: uuidv4(), name, email, password, role };
    await pool.query(
      'INSERT INTO admins (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [newAdmin.id, newAdmin.name, newAdmin.email, newAdmin.password, newAdmin.role]
    );
    const { password: _, ...safeAdmin } = newAdmin;
    res.status(201).json(safeAdmin);
  });

  app.delete('/api/admins/:id', async (req, res) => {
    await pool.query('DELETE FROM admins WHERE id = ?', [req.params.id]);
    res.status(204).send();
  });

  app.get('/api/stats', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const [studentRows] = await pool.query('SELECT COUNT(*) as count FROM students');
    const totalStudents = (studentRows as any)[0].count;

    const [attendanceRows] = await pool.query('SELECT studentId, status FROM attendance WHERE DATE(timestamp) = ?', [today]);
    const attendanceLogs = attendanceRows as any[];
    
    const presentCount = new Set(attendanceLogs.map(l => l.studentId)).size;
    const lateCount = attendanceLogs.filter(l => l.status === 'LATE').length;
    
    const [unknownRows] = await pool.query('SELECT COUNT(*) as count FROM unknown_scans');
    
    res.json({
      totalStudents,
      presentToday: presentCount,
      absentToday: Math.max(0, totalStudents - presentCount),
      lateStudents: lateCount,
      unknownScans: (unknownRows as any)[0].count,
      activeDevices: 4, 
    });
  });

  app.get('/api/students', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM students');
    const students = (rows as any[]).map(row => {
      const data = typeof row.dynamic_data === 'string' ? JSON.parse(row.dynamic_data) : row.dynamic_data;
      return {
        id: row.id,
        rfidUid: row.rfidUid,
        photoUrl: row.photoUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        ...(data || {})
      };
    });
    res.json(students);
  });

  app.post('/api/students', async (req, res) => {
    const { id, rfidUid, photoUrl, createdAt, updatedAt, ...dynamicData } = req.body;
    const newStudent = {
      id: id || uuidv4(),
      rfidUid: rfidUid || '',
      photoUrl: photoUrl || '',
      dynamic_data: JSON.stringify(dynamicData),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await pool.query(
      'INSERT INTO students (id, rfidUid, photoUrl, dynamic_data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [newStudent.id, newStudent.rfidUid, newStudent.photoUrl, newStudent.dynamic_data, newStudent.createdAt, newStudent.updatedAt]
    );
    res.status(201).json({ id: newStudent.id, ...dynamicData });
  });

  app.delete('/api/students/:id', async (req, res) => {
    await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.status(204).send();
  });

  app.put('/api/students/:id', async (req, res) => {
    const { id, rfidUid, photoUrl, createdAt, updatedAt, ...dynamicData } = req.body;
    
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if ((rows as any[]).length === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    const current = (rows as any)[0];
    const newDynamicData = { ...(typeof current.dynamic_data === 'string' ? JSON.parse(current.dynamic_data) : current.dynamic_data), ...dynamicData };

    await pool.query(
      'UPDATE students SET dynamic_data = ?, updatedAt = ? WHERE id = ?',
      [JSON.stringify(newDynamicData), new Date(), req.params.id]
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

  app.post('/api/rfid/scan', async (req, res) => {
    const { rfidUid } = req.body;
    const [rows] = await pool.query('SELECT * FROM students WHERE rfidUid = ?', [rfidUid]);
    
    if ((rows as any[]).length > 0) {
      const studentRow = (rows as any)[0];
      const data = typeof studentRow.dynamic_data === 'string' ? JSON.parse(studentRow.dynamic_data) : studentRow.dynamic_data;
      const student = { id: studentRow.id, rfidUid: studentRow.rfidUid, photoUrl: studentRow.photoUrl, ...data };
      
      const log = {
        id: uuidv4(),
        studentId: studentRow.id,
        timestamp: new Date(),
        type: 'ENTRY',
        status: 'PRESENT',
      };
      
      await pool.query(
        'INSERT INTO attendance (id, studentId, timestamp, type, status) VALUES (?, ?, ?, ?, ?)',
        [log.id, log.studentId, log.timestamp, log.type, log.status]
      );

      res.json({ success: true, student, log });
    } else {
      await pool.query(
        'INSERT INTO unknown_scans (id, rfidUid, timestamp) VALUES (?, ?, ?)',
        [uuidv4(), rfidUid, new Date()]
      );
      res.status(404).json({ success: false, error: 'RFID Not Registered' });
    }
  });

  app.get('/api/attendance/logs', async (req, res) => {
    const [rows] = await pool.query('SELECT a.*, s.dynamic_data, s.photoUrl FROM attendance a LEFT JOIN students s ON a.studentId = s.id ORDER BY a.timestamp DESC LIMIT 50');
    
    const enrichedLogs = (rows as any[]).map(log => {
      const data = typeof log.dynamic_data === 'string' ? JSON.parse(log.dynamic_data) : log.dynamic_data;
      return {
        id: log.id,
        studentId: log.studentId,
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
