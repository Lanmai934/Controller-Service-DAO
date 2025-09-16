/**
 * 用户数据访问层 (DAO)
 * 负责与数据库进行交互，执行CRUD操作
 * 这里使用内存数组模拟数据库，实际项目中应该连接真实数据库
 */
class UserDao {
  constructor() {
    // 模拟数据库数据
    this.users = [
      {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        age: 25,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 2,
        name: '李四',
        email: 'lisi@example.com',
        age: 30,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      }
    ];
    this.nextId = 3;
  }

  /**
   * 查找所有用户
   */
  async findAll() {
    // 模拟异步数据库操作
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.users]);
      }, 100);
    });
  }

  /**
   * 根据ID查找用户
   */
  async findById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id == id);
        resolve(user || null);
      }, 50);
    });
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.email === email);
        resolve(user || null);
      }, 50);
    });
  }

  /**
   * 创建新用户
   */
  async create(userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: this.nextId++,
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.users.push(newUser);
        resolve({ ...newUser });
      }, 100);
    });
  }

  /**
   * 更新用户信息
   */
  async update(id, userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id == id);
        if (userIndex === -1) {
          resolve(null);
          return;
        }

        // 更新用户数据
        this.users[userIndex] = {
          ...this.users[userIndex],
          ...userData,
          updatedAt: new Date()
        };

        resolve({ ...this.users[userIndex] });
      }, 100);
    });
  }

  /**
   * 删除用户
   */
  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => u.id == id);
        if (userIndex === -1) {
          resolve(false);
          return;
        }

        this.users.splice(userIndex, 1);
        resolve(true);
      }, 100);
    });
  }

  /**
   * 根据条件查找用户
   */
  async findByCondition(condition) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.users.filter(user => {
          return Object.keys(condition).every(key => {
            return user[key] === condition[key];
          });
        });
        resolve(users);
      }, 100);
    });
  }

  /**
   * 分页查询用户
   */
  async findWithPagination(page = 1, limit = 10) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = this.users.slice(startIndex, endIndex);
        
        resolve({
          users: paginatedUsers,
          total: this.users.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(this.users.length / limit)
        });
      }, 100);
    });
  }

  /**
   * 统计用户数量
   */
  async count() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.users.length);
      }, 50);
    });
  }
}

module.exports = new UserDao();

/* 
实际项目中，这里应该使用真实的数据库连接，例如：

const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

class UserDao {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  async findAll() {
    const [rows] = await this.pool.execute('SELECT * FROM users');
    return rows;
  }

  async findById(id) {
    const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // ... 其他数据库操作方法
}
*/