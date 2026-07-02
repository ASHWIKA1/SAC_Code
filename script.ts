import mysql from 'mysql2/promise';
import 'dotenv/config';

async function run() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rfid_attendance'
  };

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Emptying students table...");
    await connection.query('DELETE FROM students');
    console.log("Fetching admin credentials...");
    const [admins] = await connection.query('SELECT * FROM admins');
    console.log(JSON.stringify(admins, null, 2));
    await connection.end();
  } catch (error) {
    console.error(error);
  }
}
run();
