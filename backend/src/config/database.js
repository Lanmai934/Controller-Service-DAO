const mysql = require('mysql2/promise');
const config = require('./config');

/**
 * 数据库配置类
 * 支持MySQL连接池管理
 */
class Database {
  constructor() {
    this.pool = null;
    this.connected = false;
    this.init();
  }

  /**
   * 初始化数据库连接池
   */
  async init() {
    try {
      // 暂时跳过数据库连接，使用模拟数据进行演示
      console.log('📊 数据库连接池已初始化 (演示模式)');
      this.connected = true;
      
      // 如果需要真实数据库连接，取消注释以下代码
      /*
      this.pool = mysql.createPool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        waitForConnections: true,
        connectionLimit: config.database.pool.max,
        queueLimit: 0,
        charset: 'utf8mb4'
      });
      await this.testConnection();
      */
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取连接池
   */
  getPool() {
    if (!this.pool) {
      throw new Error('数据库连接池未初始化');
    }
    return this.pool;
  }

  /**
   * 执行SQL查询
   */
  async execute(sql, params = []) {
    try {
      console.log('🔍 执行SQL:', sql);
      if (params.length > 0) {
        console.log('📝 参数:', params);
      }
      
      const [rows, fields] = await this.pool.execute(sql, params);
      return { rows, fields };
    } catch (error) {
      console.error('❌ SQL执行失败:', error.message);
      throw error;
    }
  }

  /**
   * 测试数据库连接
   */
  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      
      console.log('✅ 数据库连接测试通过');
      this.connected = true;
      return true;
    } catch (error) {
      console.error('❌ 数据库连接测试失败:', error.message);
      this.connected = false;
      throw error;
    }
  }

  /**
   * 关闭数据库连接池
   */
  async close() {
    try {
      if (this.pool) {
        await this.pool.end();
        console.log('🔌 数据库连接池已关闭');
        this.connected = false;
      }
    } catch (error) {
      console.error('❌ 关闭数据库连接池失败:', error.message);
      throw error;
    }
  }
}

// 创建数据库实例
const database = new Database();

module.exports = database;