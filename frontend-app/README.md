# Frontend App

基于 Vue.js 3 的现代化前端应用，与后端 API 完全分离。

## 🚀 技术栈

- **Vue.js 3** - 渐进式 JavaScript 框架
- **Vite** - 快速构建工具
- **Element Plus** - Vue 3 组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理
- **Axios** - HTTP 客户端
- **TypeScript** - 类型安全

## 📦 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env.development
```

2. 根据需要修改 `.env.development` 中的配置

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
frontend-app/
├── public/                 # 静态资源
├── src/                   # 源代码
│   ├── components/        # 通用组件
│   ├── views/            # 页面组件
│   │   ├── Home.vue      # 首页
│   │   ├── Users.vue     # 用户管理
│   │   └── About.vue     # 关于页面
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── services/         # API 服务
│   │   └── apiClient.js  # API 客户端
│   ├── App.vue           # 根组件
│   └── main.js           # 应用入口
├── .env.example          # 环境变量示例
├── .env.development      # 开发环境配置
├── vite.config.js        # Vite 配置
└── package.json          # 项目配置
```

## 🔧 开发指南

### API 集成

项目使用 Axios 进行 API 调用，配置文件位于 `src/services/apiClient.js`。

#### 基本用法

```javascript
import { api, userApi } from '@/services/apiClient'

// 通用 API 调用
const response = await api.get('/api/endpoint')

// 用户相关 API
const users = await userApi.getUsers()
const user = await userApi.getUser(1)
```

#### 错误处理

API 客户端包含统一的错误处理机制：

- 自动处理 HTTP 状态码错误
- 显示用户友好的错误消息
- 自动处理认证失效

### 环境变量

支持的环境变量：

- `VITE_API_BASE_URL` - 后端 API 基础 URL
- `VITE_API_TIMEOUT` - API 请求超时时间
- `VITE_ENABLE_DEBUG` - 是否启用调试模式

### 代码规范

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 检查代码规范
npm run lint

# 自动格式化代码
npm run format
```

### 类型检查

```bash
npm run type-check
```

## 🧪 测试

### 运行测试

```bash
npm run test
```

### 测试覆盖率

```bash
npm run coverage
```

### 可视化测试

```bash
npm run test:ui
```

## 📱 响应式设计

项目采用响应式设计，支持：

- 桌面端 (>= 1200px)
- 平板端 (768px - 1199px)
- 移动端 (< 768px)

## 🔗 API 文档

后端 API 文档可通过以下地址访问：
- 开发环境: http://localhost:3000/api-docs

## 🚀 部署

### 构建优化

生产构建包含以下优化：

- 代码分割和懒加载
- 资源压缩和优化
- Tree-shaking 移除未使用代码
- 自动生成 Service Worker

### 部署到静态服务器

构建完成后，`dist` 目录包含所有静态文件，可部署到任何静态服务器：

- Nginx
- Apache
- Vercel
- Netlify
- GitHub Pages

### 环境配置

不同环境使用不同的配置文件：

- 开发环境: `.env.development`
- 生产环境: `.env.production`
- 测试环境: `.env.test`

## 🔧 故障排除

### 常见问题

1. **API 连接失败**
   - 检查后端服务是否启动
   - 确认 `VITE_API_BASE_URL` 配置正确

2. **依赖安装失败**
   - 清除 npm 缓存: `npm cache clean --force`
   - 删除 `node_modules` 重新安装

3. **构建失败**
   - 检查 TypeScript 类型错误
   - 确认所有依赖版本兼容

### 调试技巧

- 使用 Vue DevTools 调试组件状态
- 在 `.env.development` 中启用 `VITE_ENABLE_DEBUG`
- 查看浏览器控制台的网络请求

## 📚 相关链接

- [Vue.js 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Element Plus 组件库](https://element-plus.org/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Pinia 状态管理](https://pinia.vuejs.org/)

## 📄 许可证

MIT License