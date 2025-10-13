# 🚀 前后端自动对齐 - 快速开始

## 一分钟体验完整流程

### 1. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
npm run setup:frontend

# 安装Mock服务器（可选）
npm install -g @stoplight/prism-cli
```

### 2. 启动完整开发环境
```bash
# 一键启动：后端服务 + API监听
npm run dev:full
```

### 3. 生成前端SDK
```bash
# 生成SDK（首次需要手动执行）
npm run generate-sdk
```

### 4. 体验自动同步
1. 打开 `src/routes/userRoutes.js`
2. 添加一个新的API接口（复制现有的即可）
3. 保存文件
4. 观察控制台输出，SDK会自动重新生成！

### 5. 查看结果
- 访问 http://localhost:3000/api-docs 查看API文档
- 查看 `frontend/src/api/` 目录下自动生成的SDK代码
- 查看 `openapi.json` 文件的自动更新

## 🎭 体验Mock模式

### 1. 启用Mock
```bash
cd frontend
cp .env.example .env
# 编辑 .env 文件，设置 VITE_USE_MOCK=true
```

### 2. 启动Mock服务器
```bash
npm run start-mock
```

### 3. 访问Mock API
- Mock API: http://localhost:4010
- Mock管理界面: http://localhost:4010/__admin/docs

## 📋 核心命令速查

| 命令 | 功能 |
|------|------|
| `npm run dev:full` | 启动完整开发环境（后端+监听） |
| `npm run generate-sdk` | 手动生成前端SDK |
| `npm run sync-api` | 启动API变更监听 |
| `npm run start-mock` | 启动Mock服务器 |
| `npm run setup:frontend` | 安装前端依赖 |

## 🎯 验证效果

### 1. 检查自动生成的文件
- ✅ `openapi.json` - API规范文件
- ✅ `docs/openapi.json` - 备份文件
- ✅ `frontend/src/api/` - 自动生成的SDK

### 2. 检查API文档
- 访问 http://localhost:3000/api-docs
- 查看完整的API文档和交互界面

### 3. 检查前端集成
- 查看 `frontend/src/services/apiClient.js`
- 查看 `frontend/src/App.vue` 中的使用示例

## 🔧 常见问题

**Q: SDK生成失败？**
A: 确保后端服务已启动，`openapi.json` 文件存在

**Q: API监听不工作？**
A: 检查 `npm run sync-api` 是否正在运行

**Q: Mock服务器启动失败？**
A: 运行 `npm install -g @stoplight/prism-cli` 安装依赖

**Q: 前端依赖安装失败？**
A: 手动进入 `frontend` 目录执行 `npm install`

## 📖 下一步

- 阅读完整文档：[README-API-SYNC.md](./README-API-SYNC.md)
- 了解项目架构和配置详情
- 根据实际需求调整配置

---

🎉 **恭喜！** 你已经成功体验了前后端自动对齐的完整流程！