const userDao = require('../dao/userDao');
const User = require('../models/User');

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
      const users = await userDao.findAll();
      return users;
    } catch (error) {
      throw new Error(`获取用户列表失败: ${error.message}`);
    }
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(id) {
    try {
      if (!id) {
        throw new Error('用户ID不能为空');
      }

      const user = await userDao.findById(id);
      return user;
    } catch (error) {
      throw new Error(`获取用户信息失败: ${error.message}`);
    }
  }

  /**
   * 创建新用户
   */
  async createUser(userData) {
    try {
      // 数据验证
      this.validateUserData(userData);

      // 检查邮箱是否已存在
      const existingUser = await userDao.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('邮箱已被注册');
      }

      // 创建用户对象
      const user = new User(userData);
      
      // 保存到数据库
      const newUser = await userDao.create(user);
      return newUser;
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(id, userData) {
    try {
      if (!id) {
        throw new Error('用户ID不能为空');
      }

      // 检查用户是否存在
      const existingUser = await userDao.findById(id);
      if (!existingUser) {
        return null;
      }

      // 如果更新邮箱，检查新邮箱是否已被其他用户使用
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await userDao.findByEmail(userData.email);
        if (emailExists) {
          throw new Error('邮箱已被其他用户使用');
        }
      }

      // 更新用户信息
      const updatedUser = await userDao.update(id, userData);
      return updatedUser;
    } catch (error) {
      throw new Error(`更新用户信息失败: ${error.message}`);
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(id) {
    try {
      if (!id) {
        throw new Error('用户ID不能为空');
      }

      // 检查用户是否存在
      const existingUser = await userDao.findById(id);
      if (!existingUser) {
        return false;
      }

      // 删除用户
      await userDao.delete(id);
      return true;
    } catch (error) {
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