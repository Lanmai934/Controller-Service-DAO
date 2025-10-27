const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 导入Swagger配置
const { swaggerSpec, swaggerUi } = require('./src/config/swagger');

// 导入路由
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet()); // 安全中间件
app.use(cors()); // 跨域中间件
app.use(morgan('combined')); // 日志中间件
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Controller-Service-DAO API文档',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}));

// 路由配置
app.use('/api/users', userRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Express 三层架构 API 服务',
    version: '1.0.0',
    architecture: 'Controller-Service-DAO',
    documentation: {
      swagger: '/api-docs',
      description: '访问 /api-docs 查看完整的API文档和测试界面'
    }
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请联系管理员'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;