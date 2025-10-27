const userDao = require('../dao/userDao');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

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
 * 负责处理业务逻辑，调用DAO层进行数据操作
 */
class UserService {
  /**
   * 获取所有用户
   */
  async getAllUsers() {
    try {
      logService('getAllUsers', {});
      const users = await userDao.findAll();
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

      const user = await userDao.findById(id);
      logService('getUserById', { id }, user);
      return user;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空')) {
        logService('getUserById', { id }, null, error);
      }
      throw new Error(`获取用户信息失败: ${error.message}`);
    }
  }

  /**
   * 创建新用户
   */
  async createUser(userData) {
    try {
      logService('createUser', { userData: { ...userData, password: userData.password ? '[已隐藏]' : undefined } });
      
      // 数据验证
      this.validateUserData(userData);

      // 检查邮箱是否已存在
      const existingUser = await userDao.findByEmail(userData.email);
      if (existingUser) {
        const error = new Error('邮箱已被注册');
        logService('createUser', { userData: { ...userData, password: '[已隐藏]' } }, null, error);
        throw error;
      }

      // 创建用户对象
      const user = new User(userData);
      
      // 保存到数据库
      const newUser = await userDao.create(user);
      logService('createUser', { userData: { ...userData, password: '[已隐藏]' } }, newUser);
      return newUser;
    } catch (error) {
      if (!error.message.includes('邮箱已被注册')) {
        logService('createUser', { userData: { ...userData, password: '[已隐藏]' } }, null, error);
      }
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(id, userData) {
    try {
      logService('updateUser', { id, userData: { ...userData, password: userData.password ? '[已隐藏]' : undefined } });
      
      if (!id) {
        const error = new Error('用户ID不能为空');
        logService('updateUser', { id, userData: { ...userData, password: '[已隐藏]' } }, null, error);
        throw error;
      }

      // 检查用户是否存在
      const existingUser = await userDao.findById(id);
      if (!existingUser) {
        logService('updateUser', { id, userData: { ...userData, password: '[已隐藏]' } }, null);
        return null;
      }

      // 如果更新邮箱，检查新邮箱是否已被其他用户使用
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await userDao.findByEmail(userData.email);
        if (emailExists) {
          const error = new Error('邮箱已被其他用户使用');
          logService('updateUser', { id, userData: { ...userData, password: '[已隐藏]' } }, null, error);
          throw error;
        }
      }

      // 更新用户信息
      const updatedUser = await userDao.update(id, userData);
      logService('updateUser', { id, userData: { ...userData, password: '[已隐藏]' } }, updatedUser);
      return updatedUser;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空') && !error.message.includes('邮箱已被其他用户使用')) {
        logService('updateUser', { id, userData: { ...userData, password: '[已隐藏]' } }, null, error);
      }
      throw new Error(`更新用户信息失败: ${error.message}`);
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

      // 检查用户是否存在
      const existingUser = await userDao.findById(id);
      if (!existingUser) {
        logService('deleteUser', { id }, false);
        return false;
      }

      // 删除用户
      await userDao.delete(id);
      logService('deleteUser', { id }, true);
      return true;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空')) {
        logService('deleteUser', { id }, null, error);
      }
      throw new Error(`删除用户失败: ${error.message}`);
    }
  }

  /**
   * 根据邮箱查找用户
   */
  async getUserByEmail(email) {
    try {
      if (!email) {
        throw new Error('邮箱不能为空');
      }

      const user = await userDao.findByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`查找用户失败: ${error.message}`);
    }
  }

  /**
   * 用户注册
   */
  async registerUser(userData) {
    try {
      logService('registerUser', { userData: { ...userData, password: '[已隐藏]' } });
      
      // 验证必填字段
      if (!userData.password) {
        const error = new Error('密码不能为空');
        logService('registerUser', { userData: { ...userData, password: '[已隐藏]' } }, null, error);
        throw error;
      }

      // 数据验证
      this.validateUserData(userData);

      // 检查邮箱是否已存在
      // 如果提供了邮箱，才进行唯一性校验
      if (userData.email) {
        const existingUser = await userDao.findByEmail(userData.email);
        if (existingUser) {
          const error = new Error('邮箱已被注册');
          logService('registerUser', { userData: { ...userData, password: '[已隐藏]' } }, null, error);
          throw error;
        }
      }
      if (existingUser) {
        const error = new Error('邮箱已被注册');
        logService('registerUser', { userData: { ...userData, password: '[已隐藏]' } }, null, error);
        throw error;
      }

      // 创建用户对象并加密密码
      const user = new User(userData);
      await user.hashPassword();
      
      // 保存到数据库
      const newUser = await userDao.create(user);
      
      // 返回用户信息（不包含密码）
      const { password, ...userWithoutPassword } = newUser;
      logService('registerUser', { userData: { ...userData, password: '[已隐藏]' } }, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('密码不能为空') && !error.message.includes('邮箱已被注册')) {
        logService('registerUser', { userData: { ...userData, password: '[已隐藏]' } }, null, error);
      }
      throw new Error(`用户注册失败: ${error.message}`);
    }
  }

  /**
   * 用户登录（支持用户名或邮箱）
   */
  async loginUser(loginKey,loginValue, password) {
    const identifier=loginKey=='email'? 'email':'username'
    console.log("pppp111",identifier, password)
    try {
      logService('loginUser', { identifier,loginValue, password: '[已隐藏]' });
      
      if (!loginValue || !password) {
        const error = new Error('用户名和密码不能为空');
        logService('loginUser', { identifier, password: '[已隐藏]' }, null, error);
        throw error;
      }

      // 查找用户（支持用户名）
      const user = await userDao.findByUsernameOrEmail(loginValue);
      if (!user) {
        const error = new Error('用户不存在或密码错误');
        logService('loginUser', { identifier, password: '[已隐藏]' }, null, error);
        throw error;
      }

      

      // 生成JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          name: user.name 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // 返回用户信息和token（不包含密码）
      const { password: userPassword, ...userWithoutPassword } = user;
      const result = {
        user: userWithoutPassword,
        token
      };
      logService('loginUser', { identifier, password: '[已隐藏]' }, { user: userWithoutPassword, token: '[JWT令牌已生成]' });
      return result;
    } catch (error) {
      if (!error.message.includes('用户名和密码不能为空') && !error.message.includes('用户不存在或密码错误')) {
        logService('loginUser', { identifier, password: '[已隐藏]' }, null, error);
      }
      throw new Error(`登录失败: ${error.message}`);
    }
  }

  /**
   * 验证用户数据
   */
  validateUserData(userData) {
    if (!userData.name || userData.name.trim() === '') {
      throw new Error('用户名不能为空');
    }

    if (!userData.email || userData.email.trim() === '') {
      throw new Error('邮箱不能为空');
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('邮箱格式不正确');
    }

    if (userData.age && (userData.age < 0 || userData.age > 150)) {
      throw new Error('年龄必须在0-150之间');
    }
  }
}

module.exports = new UserService();