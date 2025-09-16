const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * 用户路由配置
 * 定义用户相关的API端点
 */

// GET /api/users - 获取所有用户
router.get('/', userController.getAllUsers);

// GET /api/users/:id - 根据ID获取用户
router.get('/:id', userController.getUserById);

// POST /api/users - 创建新用户
router.post('/', userController.createUser);

// PUT /api/users/:id - 更新用户信息
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;