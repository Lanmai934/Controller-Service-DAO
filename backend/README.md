# Backend API 服务

基于Express.js的后端API服务，采用经典三层架构 (Controller-Service-DAO)。

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- MySQL >= 5.7
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 环境配置
1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 修改 `.env` 文件中的配置：
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=controller_service_dao
DB_USER=root
DB_PASSWORD=your_password
FRONTEND_URL=http://localhost:5173
```

### 数据库初始化
```bash
# 执行数据库脚本
mysql -u root -p < database/create_database.sql
mysql -u root -p controller_service_dao < database/create_tables.sql
```

### 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 📚 API文档

启动服务后访问：
- API文档：http://localhost:3000/api-docs
- 健康检查：http://localhost:3000/health

## 🏗️ 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器层
│   ├── services/        # 服务层
│   ├── dao/            # 数据访问层
│   ├── models/         # 数据模型
│   ├── routes/         # 路由定义
│   ├── middleware/     # 中间件
│   └── utils/          # 工具函数
├── database/           # 数据库脚本
├── package.json
└── README.md
```

## 🔧 开发指南

### 添加新的API接口

1. **创建路由** (`src/routes/`)
2. **实现控制器** (`src/controllers/`)
3. **编写服务层** (`src/services/`)
4. **实现数据访问层** (`src/dao/`)
5. **添加Swagger注解**

### 代码规范
- 使用ESLint进行代码检查
- 遵循三层架构模式
- 添加完整的Swagger文档注解

## 🧪 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

## 📦 部署

```bash
# 构建项目
npm run build

# 启动生产服务
npm start
```

## 🔗 相关链接

- [前端项目](../frontend-app/)
- [API文档](http://localhost:3000/api-docs)
- [项目文档](../docs/)