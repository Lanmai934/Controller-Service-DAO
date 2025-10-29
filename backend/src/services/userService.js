const jwt = require('jsonwebtoken');
const config = require('../config/config');

// 模拟用户数据
let mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$hash1', // 模拟加密密码
    role: 'admin',
    status: 'active',
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01')
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: '$2b$10$hash2',
    role: 'user',
    status: 'active',
    created_at: new Date('2024-01-02'),
    updated_at: new Date('2024-01-02')
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    password: '$2b$10$hash3',
    role: 'user',
    status: 'inactive',
    created_at: new Date('2024-01-03'),
    updated_at: new Date('2024-01-03')
  }
];

let nextUserId = 4;

// 服务层日志函数
const logService = (methodName, params, result = null, error = null) => {
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
  
  console.log(`\n🔧 === 服务层调试日志 ===`);
  console.log(`⏰ 时间: ${timestamp}.${milliseconds}`);
  console.log(`📋 服务方法: ${methodName}`);
  console.log(`📥 输入参数:`, params);
  if (error) {
    console.log(`❌ 执行结果: 错误`);
    console.log(`🚨 错误信息:`, error.message);
  } else if (result !== null) {
    console.log(`✅ 执行结果: 成功`);
    console.log(`📤 返回数据:`, typeof result === 'object' && result.password ? { ...result, password: '[已隐藏]' } : result);
  }
  console.log(`🔧 ========================\n`);
};

/**
 * 用户服务层
 * 负责处理业务逻辑，使用模拟数据进行演示
 */
class UserService {
  /**
   * 获取所有用户
   */
  async getAllUsers() {
    try {
      logService('getAllUsers', {});
      // 使用模拟数据，移除密码字段
      const users = mockUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      logService('getAllUsers', {}, users);
      return users;
    } catch (error) {
      logService('getAllUsers', {}, null, error);
      throw new Error(`获取用户列表失败: ${error.message}`);
    }
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id) {
    try {
      logService('getUserById', { id });
      if (!id) {
        const error = new Error('用户ID不能为空');
        logService('getUserById', { id }, null, error);
        throw error;
      }

      // 使用模拟数据
      const user = mockUsers.find(u => u.id == id);
      if (!user) {
        const error = new Error('用户不存在');
        logService('getUserById', { id }, null, error);
        throw error;
      }

      // 移除密码字段
      const { password, ...userWithoutPassword } = user;
      logService('getUserById', { id }, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空') && !error.message.includes('用户不存在')) {
        logService('getUserById', { id }, null, error);
        throw new Error(`获取用户失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 创建用户
   */
  async createUser(userData) {
    try {
      logService('createUser', userData);
      
      // 验证必填字段
      if (!userData.username || !userData.email) {
        const error = new Error('用户名和邮箱不能为空');
        logService('createUser', userData, null, error);
        throw error;
      }

      // 检查用户名是否已存在
      const existingUser = mockUsers.find(u => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        const error = new Error('用户名或邮箱已存在');
        logService('createUser', userData, null, error);
        throw error;
      }

      // 创建新用户
      const newUser = {
        id: nextUserId++,
        username: userData.username,
        email: userData.email,
        password: userData.password || '$2b$10$defaulthash',
        role: userData.role || 'user',
        status: userData.status || 'active',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockUsers.push(newUser);

      // 返回用户信息（不包含密码）
      const { password, ...userWithoutPassword } = newUser;
      logService('createUser', userData, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('用户名和邮箱不能为空') && !error.message.includes('用户名或邮箱已存在')) {
        logService('createUser', userData, null, error);
        throw new Error(`创建用户失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 更新用户
   */
  async updateUser(id, userData) {
    try {
      logService('updateUser', { id, userData });
      
      if (!id) {
        const error = new Error('用户ID不能为空');
        logService('updateUser', { id, userData }, null, error);
        throw error;
      }

      // 查找用户
      const userIndex = mockUsers.findIndex(u => u.id == id);
      if (userIndex === -1) {
        const error = new Error('用户不存在');
        logService('updateUser', { id, userData }, null, error);
        throw error;
      }

      // 更新用户信息
      const updatedUser = {
        ...mockUsers[userIndex],
        ...userData,
        id: mockUsers[userIndex].id, // 保持ID不变
        updated_at: new Date()
      };

      mockUsers[userIndex] = updatedUser;

      // 返回用户信息（不包含密码）
      const { password, ...userWithoutPassword } = updatedUser;
      logService('updateUser', { id, userData }, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空') && !error.message.includes('用户不存在')) {
        logService('updateUser', { id, userData }, null, error);
        throw new Error(`更新用户失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id) {
    try {
      logService('deleteUser', { id });
      
      if (!id) {
        const error = new Error('用户ID不能为空');
        logService('deleteUser', { id }, null, error);
        throw error;
      }

      // 查找用户
      const userIndex = mockUsers.findIndex(u => u.id == id);
      if (userIndex === -1) {
        const error = new Error('用户不存在');
        logService('deleteUser', { id }, null, error);
        throw error;
      }

      // 删除用户
      const deletedUser = mockUsers.splice(userIndex, 1)[0];
      
      // 返回删除的用户信息（不包含密码）
      const { password, ...userWithoutPassword } = deletedUser;
      logService('deleteUser', { id }, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空') && !error.message.includes('用户不存在')) {
        logService('deleteUser', { id }, null, error);
        throw new Error(`删除用户失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 用户注册
   */
  async registerUser(userData) {
    try {
      logService('registerUser', userData);
      return await this.createUser(userData);
    } catch (error) {
      logService('registerUser', userData, null, error);
      throw error;
    }
  }

  /**
   * 用户登录
   */
  async loginUser(loginKey, loginValue, password) {
    try {
      logService('loginUser', { loginKey, loginValue, password: '[已隐藏]' });
      
      // 查找用户
      const user = mockUsers.find(u => u[loginKey] === loginValue);
      if (!user) {
        const error = new Error('用户不存在');
        logService('loginUser', { loginKey, loginValue }, null, error);
        throw error;
      }

      // 简单的密码验证（实际应用中应该使用bcrypt）
      if (user.password !== password && password !== '123456') { // 演示用的简单密码
        const error = new Error('密码错误');
        logService('loginUser', { loginKey, loginValue }, null, error);
        throw error;
      }

      // 生成JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // 返回用户信息和token
      const { password: _, ...userWithoutPassword } = user;
      const result = {
        user: userWithoutPassword,
        token
      };
      
      logService('loginUser', { loginKey, loginValue }, result);
      return result;
    } catch (error) {
      if (!error.message.includes('用户不存在') && !error.message.includes('密码错误')) {
        logService('loginUser', { loginKey, loginValue }, null, error);
        throw new Error(`登录失败: ${error.message}`);
      }
      throw error;
    }
  }
}

module.exports = new UserService();