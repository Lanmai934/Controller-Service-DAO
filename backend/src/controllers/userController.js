const userService = require('../services/userService');

// 请求日志中间件
const logRequest = (req, method) => {
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
  
  console.log(`\n🌐 === API调试日志 ===`);
  console.log(`⏰ 时间: ${timestamp}.${milliseconds}`);
  console.log(`🔗 方法: ${req.method}`);
  console.log(`📍 路径: ${req.path}`);
  console.log(`🎯 控制器方法: ${method}`);
  console.log(`📋 请求参数:`, req.params);
  console.log(`🔍 查询参数:`, req.query);
  console.log(`📦 请求体:`, req.body);
  console.log(`🌐 ==================\n`);
};

/**
 * 用户控制器
 * 负责处理HTTP请求和响应，调用Service层处理业务逻辑
 */

/**
 * 获取用户统计信息 - 测试API同步功能
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
const getUserStats = async (req, res) => {
  logRequest(req, 'getUserStats');
  
  try {
    const stats = await userService.getUserStats();
    res.status(200).json({
      success: true,
      message: '获取用户统计信息成功',
      data: stats
    });
  } catch (error) {
    console.error('获取用户统计信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户统计信息失败',
      error: error.message
    });
  }
};
class UserController {
  /**
   * 获取所有用户
   */
  async getAllUsers(req, res) {
    logRequest(req, 'getAllUsers');
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
    logRequest(req, 'getUserById');
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
    logRequest(req, 'createUser');
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
    logRequest(req, 'updateUser');
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
    logRequest(req, 'deleteUser');
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

  /**
   * 用户注册
   */
  async register(req, res) {
    logRequest(req, 'register');
    try {
      const userData = req.body;
      const newUser = await userService.registerUser(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: '用户注册成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '用户注册失败',
        error: error.message
      });
    }
  }

  /**
   * 用户登录
   */
  async login(req, res) {
    logRequest(req,'login');
    try {
      // 根据请求体字段判断使用邮箱还是名字登录
      const loginKey = req.body.email ? 'email' : 'username';
      const loginValue = req.body[loginKey];
      const password = req.body.password;
      console.log("1111",req.body,loginValue)
      const result = await userService.loginUser(loginKey,loginValue, password);
      
      res.json({
        success: true,
        data: result,
        message: '登录成功'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '登录失败',
        error: error.message
      });
    }
  }

  /**
   * 获取用户个人资料
   */
  async getUserProfile(req, res) {
    logRequest(req, 'getUserProfile');
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 移除敏感信息
      const { password, ...userProfile } = user;
      
      res.json({
        success: true,
        data: userProfile,
        message: '获取用户资料成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取用户资料失败',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();