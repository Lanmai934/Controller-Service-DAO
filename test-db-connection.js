/**
 * 数据库连接测试脚本
 * 运行此脚本来测试与lanmaisql数据库的连接
 */

const database = require('./src/config/database');

async function testDatabaseConnection() {
  console.log('开始测试数据库连接...');
  
  try {
    // 测试数据库连接
    const isConnected = await database.testConnection();
    
    if (isConnected) {
      console.log('✅ 数据库连接成功！');
      
      // 测试查询
      console.log('\n测试查询用户表...');
      const { rows } = await database.execute('SELECT COUNT(*) as count FROM users');
      console.log(`📊 用户表中共有 ${rows[0].count} 条记录`);
      
      // 查询前3条用户数据
      const { rows: users } = await database.execute('SELECT * FROM users LIMIT 3');
      console.log('\n📋 前3条用户数据:');
      users.forEach(user => {
        console.log(`  - ID: ${user.id}, 姓名: ${user.name}, 邮箱: ${user.email}, 年龄: ${user.age}`);
      });
      
    } else {
      console.log('❌ 数据库连接失败！');
    }
    
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error.message);
    console.log('\n🔧 请检查以下配置:');
    console.log('1. MySQL服务是否已启动');
    console.log('2. 数据库名称是否为 "lanmaisql"');
    console.log('3. 用户名和密码是否正确');
    console.log('4. 是否已创建users表 (运行 database/create_tables.sql)');
  } finally {
    // 关闭数据库连接
    await database.close();
    console.log('\n🔚 数据库连接已关闭');
    process.exit(0);
  }
}

// 运行测试
testDatabaseConnection();