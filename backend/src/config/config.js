require('dotenv').config();

// 调试环境变量
console.log('🔍 环境变量调试:');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_NAME:', process.env.DB_NAME);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(未设置)');

/**
 * 应用配置文件
 * 统一管理应用的各种配置项
 */
module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'controller_service_dao',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    // 连接池配置
    pool: {
      min: 0,
      max: 10,
      acquire: 30000,
      idle: 10000
    }
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: {
      enabled: true,
      path: './logs',
      maxSize: '20m',
      maxFiles: '14d'
    }
  },

  // API配置
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: process.env.API_VERSION || 'v1',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100 // 限制每个IP 15分钟内最多100个请求
    }
  },

  // 跨域配置
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // 文件上传配置
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 10 * 1024 * 1024, // 10MB
    path: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },

  // Redis配置
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: 0,
    keyPrefix: 'app:'
  },

  // 邮件配置
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    from: process.env.EMAIL_FROM || 'noreply@example.com'
  },

  // 安全配置
  security: {
    bcryptRounds: 12,
    sessionSecret: process.env.SESSION_SECRET || 'session_secret_key',
    csrfProtection: process.env.NODE_ENV === 'production'
  },

  // 分页配置
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },

  // 缓存配置
  cache: {
    ttl: 300, // 5分钟
    checkPeriod: 600 // 10分钟检查一次过期缓存
  }
};