const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// 导入Swagger配置
const { swaggerSpec, swaggerUi } = require('./config/swagger');

// 导入路由
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet()); // 安全中间件

// CORS配置 - 允许前端访问
const allowedOrigins = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',').map(url => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // 允许没有origin的请求（如移动应用或Postman）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('不允许的CORS来源'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));

app.use(morgan('combined')); // 日志中间件
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// Swagger文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Backend API文档',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}));

// API路由配置
app.use('/api/users', userRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 根路径 - API信息
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API 服务',
    version: '1.0.0',
    architecture: 'Controller-Service-DAO',
    documentation: {
      swagger: '/api-docs',
      description: '访问 /api-docs 查看完整的API文档和测试界面'
    },
    endpoints: {
      health: '/health',
      users: '/api/users',
      docs: '/api-docs'
    }
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl,
    message: '请检查API路径是否正确'
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请联系管理员',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Backend API 服务器运行在 http://localhost:${PORT}`);
  console.log(`📚 API文档地址: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 健康检查: http://localhost:${PORT}/health`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;