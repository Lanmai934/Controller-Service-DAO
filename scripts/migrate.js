const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// 数据库文件路径
const dbPath = path.join(__dirname, '..', 'database', 'database.db');
const sqlPath = path.join(__dirname, '..', 'database', 'add_password_field.sql');

try {
  // 读取SQL文件
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  // 连接数据库
  const db = new Database(dbPath);
  console.log('Connected to the SQLite database.');
  
  // 分割SQL语句并执行
  const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
  
  for (const statement of statements) {
    const trimmedStmt = statement.trim();
    if (trimmedStmt) {
      try {
        db.exec(trimmedStmt);
        console.log('Executed:', trimmedStmt.substring(0, 50) + '...');
      } catch (err) {
        if (err.message.includes('duplicate column name')) {
          console.log('Column already exists, skipping:', trimmedStmt.substring(0, 50) + '...');
        } else {
          console.error('Error executing statement:', err.message);
          console.error('Statement:', trimmedStmt);
        }
      }
    }
  }
  
  console.log('Database migration completed successfully.');
  
  // 关闭数据库连接
  db.close();
  console.log('Database connection closed.');
  
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}