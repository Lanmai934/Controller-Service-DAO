# Controller-Service-DAO

基于 Express.js 的后台服务项目，采用经典三层架构 (Controller-Service-DAO) 设计模式。

## 项目简介

本项目是一个标准的 Node.js 后端服务架构模板，采用了经典的三层架构设计：
- **Controller 层**：处理 HTTP 请求和响应
- **Service 层**：处理业务逻辑
- **DAO 层**：数据访问对象，负责与数据库交互

## 技术栈

- **Node.js** - JavaScript 运行环境
- **Express.js** - Web 应用框架
- **dotenv** - 环境变量管理
- **cors** - 跨域资源共享
- **helmet** - 安全中间件
- **morgan** - HTTP 请求日志中间件

## 项目结构

```
Controller-Service-DAO/
├── app.js                 # 应用入口文件
├── package.json           # 项目依赖配置
├── .env                   # 环境变量配置
├── README.md             # 项目说明文档
└── src/                  # 源代码目录
    ├── controllers/      # 控制器层
    │   └── userController.js
    ├── services/         # 服务层
    │   └── userService.js
    ├── dao/             # 数据访问层
    │   └── userDao.js
    ├── models/          # 数据模型
    │   └── User.js
    ├── routes/          # 路由配置
    │   └── userRoutes.js
    ├── config/          # 配置文件
    │   └── config.js
    ├── middleware/      # 中间件
    └── utils/           # 工具函数
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env` 文件并根据需要修改配置：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=controller_service_dao
DB_USER=root
DB_PASSWORD=password
```

### 3. 启动服务

```bash
# 开发模式（使用 nodemon）
npm run dev

# 生产模式
npm start
```

服务启动后，访问 http://localhost:3000

## API 接口

### 用户管理接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/users` | 获取所有用户 |
| GET | `/api/users/:id` | 根据ID获取用户 |
| POST | `/api/users` | 创建新用户 |
| PUT | `/api/users/:id` | 更新用户信息 |
| DELETE | `/api/users/:id` | 删除用户 |

### 请求示例

#### 创建用户
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  }'
```

#### 获取所有用户
```bash
curl http://localhost:3000/api/users
```

## 架构说明

### Controller 层
- 位置：`src/controllers/`
- 职责：处理 HTTP 请求和响应，参数验证，调用 Service 层
- 特点：不包含业务逻辑，只负责请求的接收和响应的返回

### Service 层
- 位置：`src/services/`
- 职责：处理业务逻辑，数据验证，调用 DAO 层
- 特点：包含核心业务逻辑，可被多个 Controller 复用

### DAO 层
- 位置：`src/dao/`
- 职责：数据访问操作，与数据库交互
- 特点：封装数据库操作，提供统一的数据访问接口

### Model 层
- 位置：`src/models/`
- 职责：定义数据结构和验证规则
- 特点：数据实体定义，包含数据验证和转换方法

## 开发指南

### 添加新功能

1. **创建 Model**：在 `src/models/` 中定义数据模型
2. **创建 DAO**：在 `src/dao/` 中实现数据访问逻辑
3. **创建 Service**：在 `src/services/` 中实现业务逻辑
4. **创建 Controller**：在 `src/controllers/` 中处理 HTTP 请求
5. **配置路由**：在 `src/routes/` 中配置 API 路由
6. **注册路由**：在 `app.js` 中注册新的路由

### 代码规范

- 使用 ES6+ 语法
- 采用 async/await 处理异步操作
- 统一的错误处理机制
- 详细的注释说明
- 遵循 RESTful API 设计规范

## 部署

### 生产环境配置

1. 设置环境变量 `NODE_ENV=production`
2. 配置真实的数据库连接
3. 设置安全的 JWT 密钥
4. 配置日志输出
5. 启用 HTTPS

### Docker 部署（可选）

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！
