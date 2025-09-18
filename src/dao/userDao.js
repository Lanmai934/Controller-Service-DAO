const database = require('../config/database');

// 数据访问层日志函数
const logDao = (methodName, params, result = null, error = null) => {
  const now = new Date();
  const timestamp = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  
  console.log(`\n💾 === 数据访问层调试日志 ===`);
  console.log(`⏰ 时间: ${timestamp}.${milliseconds}`);
  console.log(`🗄️ DAO方法: ${methodName}`);
  console.log(`📥 输入参数:`, params);
  if (error) {
    console.log(`❌ 执行结果: 数据库错误`);
    console.log(`🚨 错误信息:`, error.message);
  } else if (result !== null) {
    console.log(`✅ 执行结果: 成功`);
    if (Array.isArray(result)) {
      console.log(`📊 返回数据: 数组，长度: ${result.length}`);
      if (result.length > 0) {
        console.log(`📄 首条记录:`, typeof result[0] === 'object' && result[0].password ? { ...result[0], password: '[已隐藏]' } : result[0]);
      }
    } else {
      console.log(`📤 返回数据:`, typeof result === 'object' && result.password ? { ...result, password: '[已隐藏]' } : result);
    }
  }
  console.log(`💾 ===========================\n`);
};

/**
 * 用户数据访问层 (DAO)
 * 负责与数据库的直接交互
 */
class UserDao {
  constructor() {
    this.db = database;
  }

  /**
   * 获取所有用户
   * @returns {Promise<Array>} 用户列表
   */
  async findAll() {
    try {
      logDao('findAll', {});
      const { rows } = await this.db.execute('SELECT * FROM users ORDER BY created_at DESC');
      logDao('findAll', {}, rows);
      return rows;
    } catch (error) {
      logDao('findAll', {}, null, error);
      console.error('获取所有用户失败:', error);
      throw new Error('获取用户列表失败');
    }
  }

  /**
   * 根据ID查找用户
   * @param {number} id 用户ID
   * @returns {Promise<Object|null>} 用户对象或null
   */
  async findById(id) {
    try {
      logDao('findById', { id });
      const { rows } = await this.db.execute('SELECT * FROM users WHERE id = ?', [id]);
      const result = rows[0] || null;
      logDao('findById', { id }, result);
      return result;
    } catch (error) {
      logDao('findById', { id }, null, error);
      console.error('根据ID查找用户失败:', error);
      throw new Error('查找用户失败');
    }
  }

  /**
   * 根据邮箱查找用户
   * @param {string} email 邮箱地址
   * @returns {Promise<Object|null>} 用户对象或null
   */
  async findByEmail(email) {
    try {
      logDao('findByEmail', { email });
      const { rows } = await this.db.execute('SELECT * FROM users WHERE email = ?', [email]);
      const result = rows[0] || null;
      logDao('findByEmail', { email }, result);
      return result;
    } catch (error) {
      logDao('findByEmail', { email }, null, error);
      console.error('根据邮箱查找用户失败:', error);
      throw new Error('查找用户失败');
    }
  }

  /**
   * 创建新用户
   * @param {Object} userData 用户数据
   * @returns {Promise<Object>} 创建的用户对象
   */
  async create(userData) {
    try {
      logDao('create', { userData });
      const { name, email, age } = userData;
      const { rows } = await this.db.execute(
        'INSERT INTO users (name, email, age, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [name, email, age]
      );
      
      // 获取插入的用户ID
      const insertId = rows.insertId;
      
      // 返回创建的用户
      const newUser = await this.findById(insertId);
      logDao('create', { userData }, newUser);
      return newUser;
    } catch (error) {
      logDao('create', { userData }, null, error);
      console.error('创建用户失败:', error);
      throw new Error('创建用户失败');
    }
  }

  /**
   * 更新用户信息
   * @param {number} id 用户ID
   * @param {Object} userData 更新的用户数据
   * @returns {Promise<Object|null>} 更新后的用户对象或null
   */
  async update(id, userData) {
    try {
      logDao('update', { id, userData });
      const { name, email, age } = userData;
      const { rows } = await this.db.execute(
        'UPDATE users SET name = ?, email = ?, age = ?, updated_at = NOW() WHERE id = ?',
        [name, email, age, id]
      );
      
      // 检查是否有行被更新
      if (rows.affectedRows === 0) {
        logDao('update', { id, userData }, null);
        return null;
      }
      
      // 返回更新后的用户
      const updatedUser = await this.findById(id);
      logDao('update', { id, userData }, updatedUser);
      return updatedUser;
    } catch (error) {
      logDao('update', { id, userData }, null, error);
      console.error('更新用户失败:', error);
      throw new Error('更新用户失败');
    }
  }

  /**
   * 删除用户
   * @param {number} id 用户ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async delete(id) {
    try {
      logDao('delete', { id });
      const { rows } = await this.db.execute('DELETE FROM users WHERE id = ?', [id]);
      const success = rows.affectedRows > 0;
      logDao('delete', { id }, success);
      return success;
    } catch (error) {
      logDao('delete', { id }, null, error);
      console.error('删除用户失败:', error);
      throw new Error('删除用户失败');
    }
  }

  /**
   * 根据条件查找用户
   * @param {Object} condition 查询条件
   * @returns {Promise<Array>} 符合条件的用户列表
   */
  async findByCondition(condition) {
    try {
      let sql = 'SELECT * FROM users WHERE 1=1';
      const params = [];
      
      if (condition.name) {
        sql += ' AND name LIKE ?';
        params.push(`%${condition.name}%`);
      }
      if (condition.email) {
        sql += ' AND email LIKE ?';
        params.push(`%${condition.email}%`);
      }
      if (condition.minAge) {
        sql += ' AND age >= ?';
        params.push(condition.minAge);
      }
      if (condition.maxAge) {
        sql += ' AND age <= ?';
        params.push(condition.maxAge);
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const { rows } = await this.db.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('条件查询用户失败:', error);
      throw new Error('条件查询失败');
    }
  }

  /**
   * 分页查询用户
   * @param {number} page 页码
   * @param {number} limit 每页数量
   * @returns {Promise<Object>} 分页结果
   */
  async findWithPagination(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      // 获取总数
      const { rows: countRows } = await this.db.execute('SELECT COUNT(*) as total FROM users');
      const total = countRows[0].total;
      
      // 获取分页数据
      const { rows } = await this.db.execute(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      
      return {
        users: rows,
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('分页查询用户失败:', error);
      throw new Error('分页查询失败');
    }
  }

  /**
   * 统计用户数量
   * @returns {Promise<number>} 用户总数
   */
  async count() {
    try {
      const { rows } = await this.db.execute('SELECT COUNT(*) as total FROM users');
      return rows[0].total;
    } catch (error) {
      console.error('统计用户数量失败:', error);
      throw new Error('统计用户数量失败');
    }
  }
}

module.exports = new UserDao();