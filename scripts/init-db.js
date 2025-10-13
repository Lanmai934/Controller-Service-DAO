const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * 数据库初始化脚本
 * 创建数据库和表结构
 */
async function initDatabase() {
  let connection;
  
  try {
    console.log('🚀 开始初始化数据库...');
    
    // 首先连接到MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      charset: 'utf8mb4'
    });
    
    console.log('✅ 已连接到MySQL服务器');
    
    // 读取SQL文件
    const sqlFile = path.join(__dirname, 'init-database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // 分割SQL语句（按分号分割，忽略空语句和注释）
    const sqlStatements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // 过滤空语句、注释和USE语句
        return stmt.length > 0 && 
               !stmt.startsWith('--') && 
               !stmt.startsWith('/*') &&
               stmt.toLowerCase() !== 'use `lanmai`';
      });
    
    console.log(`📝 准备执行 ${sqlStatements.length} 条SQL语句`);
    
    // 执行每条SQL语句
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (statement) {
        try {
          console.log(`🔍 执行SQL ${i + 1}/${sqlStatements.length}: ${statement.substring(0, 50)}...`);
          await connection.query(statement);
        } catch (error) {
          console.warn(`⚠️  SQL语句执行警告: ${error.message}`);
          // 继续执行其他语句
        }
      }
    }
    
    console.log('✅ 数据库初始化完成！');
    
    // 验证数据库和表是否创建成功
    await verifyDatabase(connection);
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 数据库连接已关闭');
    }
  }
}

/**
 * 验证数据库和表是否创建成功
 */
async function verifyDatabase(connection) {
  try {
    // 切换到目标数据库
    await connection.query(`USE \`${process.env.DB_NAME || 'lanmai'}\``);
    
    // 检查表是否存在
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 已创建的表:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });
    
    // 检查用户表的记录数
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 用户表记录数: ${userCount[0].count}`);
    
  } catch (error) {
    console.error('❌ 数据库验证失败:', error.message);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };