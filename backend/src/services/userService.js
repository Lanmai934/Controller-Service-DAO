const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const userDao = require('../dao/userDao');

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
  
  console.log(`\n🔧 === 用户服务层调试日志 ===`);
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
  console.log(`🔧 ============================\n`);
};

/**
 * 用户服务层
 * 负责处理用户相关的业务逻辑，使用数据库进行数据持久化
 */
class UserService {
  /**
   * 获取所有用户
   */
  async getAllUsers() {
    try {
      logService('getAllUsers', {});
      const users = await userDao.findAll();
      
      // 移除密码字段
      const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      logService('getAllUsers', {}, usersWithoutPassword);
      return usersWithoutPassword;
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
      logService('createUser', { ...userData, password: userData.password ? '[已隐藏]' : undefined });
      
      // 验证必填字段
      if (!userData.username || !userData.email) {
        const error = new Error('用户名和邮箱不能为空');
        logService('createUser', userData, null, error);
        throw error;
      }

      // 检查用户名是否已存在
      const existingUserByUsername = await userDao.findByUsername(userData.username);
      if (existingUserByUsername) {
        const error = new Error('用户名已存在');
        logService('createUser', userData, null, error);
        throw error;
      }

      // 检查邮箱是否已存在
      const existingUserByEmail = await userDao.findByEmail(userData.email);
      if (existingUserByEmail) {
        const error = new Error('邮箱已存在');
        logService('createUser', userData, null, error);
        throw error;
      }

      // 加密密码
      let hashedPassword = null;
      if (userData.password) {
        hashedPassword = await bcrypt.hash(userData.password, 12);
      }

      // 准备用户数据
      const newUserData = {
        name: userData.name || userData.username,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user',
        age: userData.age || null
      };

      // 创建用户
      const createdUser = await userDao.create(newUserData);

      // 返回用户信息（不包含密码）
      const { password, ...userWithoutPassword } = createdUser;
      logService('createUser', userData, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('用户名和邮箱不能为空') && 
          !error.message.includes('用户名已存在') && 
          !error.message.includes('邮箱已存在')) {
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
      logService('updateUser', { id, userData: { ...userData, password: userData.password ? '[已隐藏]' : undefined } });
      
      if (!id) {
        const error = new Error('用户ID不能为空');
        logService('updateUser', { id, userData }, null, error);
        throw error;
      }

      // 检查用户是否存在
      const existingUser = await userDao.findById(id);
      if (!existingUser) {
        const error = new Error('用户不存在');
        logService('updateUser', { id, userData }, null, error);
        throw error;
      }

      // 如果更新用户名，检查是否已存在
      if (userData.username && userData.username !== existingUser.username) {
        const userWithSameUsername = await userDao.findByUsername(userData.username);
        if (userWithSameUsername) {
          const error = new Error('用户名已存在');
          logService('updateUser', { id, userData }, null, error);
          throw error;
        }
      }

      // 如果更新邮箱，检查是否已存在
      if (userData.email && userData.email !== existingUser.email) {
        const userWithSameEmail = await userDao.findByEmail(userData.email);
        if (userWithSameEmail) {
          const error = new Error('邮箱已存在');
          logService('updateUser', { id, userData }, null, error);
          throw error;
        }
      }

      // 准备更新数据
      const updateData = { ...userData };
      
      // 如果有密码，进行加密
      if (userData.password) {
        updateData.password = await bcrypt.hash(userData.password, 12);
      }

      // 更新用户
      const updatedUser = await userDao.update(id, updateData);

      // 返回用户信息（不包含密码）
      const { password, ...userWithoutPassword } = updatedUser;
      logService('updateUser', { id, userData }, userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      if (!error.message.includes('用户ID不能为空') && 
          !error.message.includes('用户不存在') &&
          !error.message.includes('用户名已存在') &&
          !error.message.includes('邮箱已存在')) {
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

      // 检查用户是否存在
      const existingUser = await userDao.findById(id);
      if (!existingUser) {
        const error = new Error('用户不存在');
        logService('deleteUser', { id }, null, error);
        throw error;
      }

      // 删除用户
      const deletedUser = await userDao.delete(id);
      
      // 返回删除的用户信息（不包含密码）
      const { password, ...userWithoutPassword } = existingUser;
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
      logService('registerUser', { ...userData, password: userData.password ? '[已隐藏]' : undefined });
      
      // 验证必填字段
      if (!userData.username || !userData.email || !userData.password) {
        const error = new Error('用户名、邮箱和密码不能为空');
        logService('registerUser', userData, null, error);
        throw error;
      }

      return await this.createUser(userData);
    } catch (error) {
      if (!error.message.includes('用户名、邮箱和密码不能为空')) {
        logService('registerUser', userData, null, error);
      }
      throw error;
    }
  }

  /**
   * 用户登录
   */
  async loginUser(loginKey, loginValue, password) {

      logService('loginUser', { loginKey, loginValue, password: '[已隐藏]' });
      
      if (!loginValue || !password) {
        const error = new Error('登录信息不能为空');
        logService('loginUser', { loginKey, loginValue }, null, error);
        throw error;
      }

      // 根据登录方式查找用户
      let user = null;
      if (loginKey === 'email') {
        user = await userDao.findByEmail(loginValue);
      } else if (loginKey === 'username') {
        user = await userDao.findByUsername(loginValue);
      } else {
        // 尝试用户名或邮箱登录
        user = await userDao.findByUsernameOrEmail(loginValue);
      }

      if (!user) {
        const error = new Error('用户不存在');
        logService('loginUser', { loginKey, loginValue }, null, error);
        throw error;
      }

      // 验证密码
      // 直接比对明文密码（已去掉加密）
      const isPasswordValid = password === user.password;
      console.log("pppp",isPasswordValid)
      if (!isPasswordValid) {
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

  }

  /**
   * 获取用户统计信息
   */
  async getUserStats() {
    try {
      logService('getUserStats', {});
      
      const totalUsers = await userDao.count();
      const allUsers = await userDao.findAll();
      
      // 统计各种角色的用户数量
      const roleStats = allUsers.reduce((stats, user) => {
        stats[user.role] = (stats[user.role] || 0) + 1;
        return stats;
      }, {});

      // 统计最近注册的用户（最近7天）
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentUsers = allUsers.filter(user => 
        new Date(user.created_at) >= sevenDaysAgo
      );

      const stats = {
        totalUsers,
        roleStats,
        recentRegistrations: recentUsers.length,
        lastRegistration: allUsers.length > 0 ? 
          Math.max(...allUsers.map(u => new Date(u.created_at).getTime())) : null
      };

      logService('getUserStats', {}, stats);
      return stats;
    } catch (error) {
      logService('getUserStats', {}, null, error);
      throw new Error(`获取用户统计信息失败: ${error.message}`);
    }
  }
}

module.exports = new UserService();