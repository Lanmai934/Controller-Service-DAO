const mysql = require('mysql2/promise');
const config = require('./config');

/**
 * 数据库连接配置
 * 使用连接池管理数据库连接
 */
class Database {
  constructor() {
    this.pool = null;
    this.init();
  }

  /**
   * 初始化数据库连接池
   */
  init() {
    try {
      this.pool = mysql.createPool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        waitForConnections: true,
        connectionLimit: config.database.pool.max,
        queueLimit: 0,
        acquireTimeout: config.database.pool.acquire,
        timeout: config.database.pool.idle,
        reconnect: true,
        charset: 'utf8mb4'
      });

      console.log('数据库连接池初始化成功');
    } catch (error) {
      console.error('数据库连接池初始化失败:', error);
      throw error;
    }
  }

  /**
   * 获取数据库连接池
   * @returns {Pool} MySQL连接池
   */
  getPool() {
    if (!this.pool) {
      throw new Error('数据库连接池未初始化');
    }
    return this.pool;
  }

  /**
   * 执行SQL查询
   * @param {string} sql SQL语句
   * @param {Array} params 参数数组
   * @returns {Promise} 查询结果
   */
  async execute(sql, params = []) {
    try {
      const [rows, fields] = await this.pool.execute(sql, params);
      return { rows, fields };
    } catch (error) {
      console.error('SQL执行错误:', error);
      throw error;
    }
  }

  /**
   * 测试数据库连接
   * @returns {Promise<boolean>} 连接是否成功
   */
  async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('数据库连接测试成功');
      return true;
    } catch (error) {
      console.error('数据库连接测试失败:', error);
      return false;
    }
  }

  /**
   * 关闭数据库连接池
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('数据库连接池已关闭');
    }
  }
}

// 创建单例实例
const database = new Database();

module.exports = database;