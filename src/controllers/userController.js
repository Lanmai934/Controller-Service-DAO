const userService = require('../services/userService');

/**
 * 用户控制器
 * 负责处理HTTP请求和响应，调用Service层处理业务逻辑
 */
class UserController {
  /**
   * 获取所有用户
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json({
        success: true,
        data: users,
        message: '获取用户列表成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取用户列表失败',
        error: error.message
      });
    }
  }

  /**
   * 根据ID获取用户
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        data: user,
        message: '获取用户信息成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取用户信息失败',
        error: error.message
      });
    }
  }

  /**
   * 创建新用户
   */
  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: '创建用户成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '创建用户失败',
        error: error.message
      });
    }
  }

  /**
   * 更新用户信息
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        data: updatedUser,
        message: '更新用户信息成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '更新用户信息失败',
        error: error.message
      });
    }
  }

  /**
   * 删除用户
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await userService.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        message: '删除用户成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '删除用户失败',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();