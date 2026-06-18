var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_uuid = require("uuid");
var import_promise = __toESM(require("mysql2/promise"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_config = require("dotenv/config");
var PORT = process.env.PORT || 3e3;
var pool;
var uploadDir = import_path.default.join(process.cwd(), "uploads");
if (!import_fs.default.existsSync(uploadDir)) {
  import_fs.default.mkdirSync(uploadDir, { recursive: true });
}
var storage = import_multer.default.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + import_path.default.extname(file.originalname));
  }
});
var upload = (0, import_multer.default)({ storage });
async function initDB() {
  const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  };
  const dbName = process.env.DB_NAME || "rfid_attendance";
  const connection = await import_promise.default.createConnection(dbConfig);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();
  pool = import_promise.default.createPool({
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
  const [adminRows] = await pool.query("SELECT * FROM admins WHERE email = ?", ["itsupport@technosprint.net"]);
  if (adminRows.length === 0) {
    await pool.query(
      "INSERT INTO admins (id, name, email, role, password) VALUES (?, ?, ?, ?, ?)",
      [(0, import_uuid.v4)(), "IT Support", "itsupport@technosprint.net", "Ultra Admin", "Poland@01"]
    );
  }
}
async function startServer() {
  await initDB();
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  app.use("/uploads", import_express.default.static(uploadDir));
  app.post("/api/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM admins WHERE email = ? AND password = ?", [email, password]);
    const admins = rows;
    if (admins.length > 0) {
      const { password: password2, ...userWithoutPassword } = admins[0];
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  });
  app.get("/api/admins", async (req, res) => {
    const [rows] = await pool.query("SELECT id, name, email, role FROM admins");
    res.json(rows);
  });
  app.post("/api/admins", async (req, res) => {
    const { name, email, password, role } = req.body;
    const [existing] = await pool.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    const newAdmin = { id: (0, import_uuid.v4)(), name, email, password, role };
    await pool.query(
      "INSERT INTO admins (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [newAdmin.id, newAdmin.name, newAdmin.email, newAdmin.password, newAdmin.role]
    );
    const { password: _, ...safeAdmin } = newAdmin;
    res.status(201).json(safeAdmin);
  });
  app.delete("/api/admins/:id", async (req, res) => {
    await pool.query("DELETE FROM admins WHERE id = ?", [req.params.id]);
    res.status(204).send();
  });
  app.get("/api/stats", async (req, res) => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const [studentRows] = await pool.query("SELECT COUNT(*) as count FROM students");
    const totalStudents = studentRows[0].count;
    const [attendanceRows] = await pool.query("SELECT studentId, status FROM attendance WHERE DATE(timestamp) = ?", [today]);
    const attendanceLogs = attendanceRows;
    const presentCount = new Set(attendanceLogs.map((l) => l.studentId)).size;
    const lateCount = attendanceLogs.filter((l) => l.status === "LATE").length;
    const [unknownRows] = await pool.query("SELECT COUNT(*) as count FROM unknown_scans");
    res.json({
      totalStudents,
      presentToday: presentCount,
      absentToday: Math.max(0, totalStudents - presentCount),
      lateStudents: lateCount,
      unknownScans: unknownRows[0].count,
      activeDevices: 4
    });
  });
  app.get("/api/students", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM students");
    const students = rows.map((row) => {
      const data = typeof row.dynamic_data === "string" ? JSON.parse(row.dynamic_data) : row.dynamic_data;
      return {
        id: row.id,
        rfidUid: row.rfidUid,
        photoUrl: row.photoUrl,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        ...data || {}
      };
    });
    res.json(students);
  });
  app.post("/api/students", async (req, res) => {
    const { id, rfidUid, photoUrl, createdAt, updatedAt, ...dynamicData } = req.body;
    const newStudent = {
      id: id || (0, import_uuid.v4)(),
      rfidUid: rfidUid || "",
      photoUrl: photoUrl || "",
      dynamic_data: JSON.stringify(dynamicData),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    await pool.query(
      "INSERT INTO students (id, rfidUid, photoUrl, dynamic_data, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [newStudent.id, newStudent.rfidUid, newStudent.photoUrl, newStudent.dynamic_data, newStudent.createdAt, newStudent.updatedAt]
    );
    res.status(201).json({ id: newStudent.id, ...dynamicData });
  });
  app.delete("/api/students/:id", async (req, res) => {
    await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
    res.status(204).send();
  });
  app.put("/api/students/:id", async (req, res) => {
    const { id, rfidUid, photoUrl, createdAt, updatedAt, ...dynamicData } = req.body;
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    const current = rows[0];
    const newDynamicData = { ...typeof current.dynamic_data === "string" ? JSON.parse(current.dynamic_data) : current.dynamic_data, ...dynamicData };
    await pool.query(
      "UPDATE students SET dynamic_data = ?, updatedAt = ? WHERE id = ?",
      [JSON.stringify(newDynamicData), /* @__PURE__ */ new Date(), req.params.id]
    );
    res.json({ success: true });
  });
  app.post("/api/students/:id/rfid", async (req, res) => {
    const { rfidUid } = req.body;
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    const [existing] = await pool.query("SELECT * FROM students WHERE rfidUid = ? AND id != ?", [rfidUid, req.params.id]);
    if (existing.length > 0) {
      res.status(400).json({ error: "RFID tag already assigned to another student" });
      return;
    }
    await pool.query("UPDATE students SET rfidUid = ?, updatedAt = ? WHERE id = ?", [rfidUid, /* @__PURE__ */ new Date(), req.params.id]);
    res.json({ success: true });
  });
  app.post("/api/rfid/scan", async (req, res) => {
    const { rfidUid } = req.body;
    const [rows] = await pool.query("SELECT * FROM students WHERE rfidUid = ?", [rfidUid]);
    if (rows.length > 0) {
      const studentRow = rows[0];
      const data = typeof studentRow.dynamic_data === "string" ? JSON.parse(studentRow.dynamic_data) : studentRow.dynamic_data;
      const student = { id: studentRow.id, rfidUid: studentRow.rfidUid, photoUrl: studentRow.photoUrl, ...data };
      const log = {
        id: (0, import_uuid.v4)(),
        studentId: studentRow.id,
        timestamp: /* @__PURE__ */ new Date(),
        type: "ENTRY",
        status: "PRESENT"
      };
      await pool.query(
        "INSERT INTO attendance (id, studentId, timestamp, type, status) VALUES (?, ?, ?, ?, ?)",
        [log.id, log.studentId, log.timestamp, log.type, log.status]
      );
      res.json({ success: true, student, log });
    } else {
      await pool.query(
        "INSERT INTO unknown_scans (id, rfidUid, timestamp) VALUES (?, ?, ?)",
        [(0, import_uuid.v4)(), rfidUid, /* @__PURE__ */ new Date()]
      );
      res.status(404).json({ success: false, error: "RFID Not Registered" });
    }
  });
  app.get("/api/attendance/logs", async (req, res) => {
    const [rows] = await pool.query("SELECT a.*, s.dynamic_data, s.photoUrl FROM attendance a LEFT JOIN students s ON a.studentId = s.id ORDER BY a.timestamp DESC LIMIT 50");
    const enrichedLogs = rows.map((log) => {
      const data = typeof log.dynamic_data === "string" ? JSON.parse(log.dynamic_data) : log.dynamic_data;
      return {
        id: log.id,
        studentId: log.studentId,
        timestamp: log.timestamp,
        type: log.type,
        status: log.status,
        student: { id: log.studentId, photoUrl: log.photoUrl, ...data || {} }
      };
    });
    res.json(enrichedLogs);
  });
  app.get("/api/settings/columns", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT setting_value FROM settings WHERE setting_key = ?", ["excel_columns"]);
      if (rows.length > 0) {
        res.json(rows[0].setting_value);
      } else {
        res.json(null);
      }
    } catch (err) {
      res.status(500).json({ error: "DB Error" });
    }
  });
  app.post("/api/settings/columns", async (req, res) => {
    try {
      const { columns, photoColumn } = req.body;
      const val = JSON.stringify({ columns, photoColumn });
      await pool.query(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        ["excel_columns", val, val]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "DB Error" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer().catch(console.error);
//# sourceMappingURL=server.cjs.map
