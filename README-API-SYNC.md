# 前后端自动对齐解决方案

本项目实现了一套完整的前后端自动对齐流程，包括：
- 后端自动导出接口规范
- 前端自动拉取 + 生成 SDK
- 可选自动 Mock
- 不需要手动写接口封装
- 接口变更时类型、文档、调用代码全自动更新

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
npm run setup:frontend

# 全局安装Mock服务器（可选）
npm install -g @stoplight/prism-cli
```

### 2. 启动服务

```bash
# 方式一：完整开发模式（推荐）
# 同时启动后端服务和API监听
npm run dev:full

# 方式二：分别启动
npm run dev          # 启动后端服务
npm run sync-api     # 启动API变更监听（新终端）

# 方式三：启动Mock服务器（可选）
npm run start-mock   # 启动Mock服务器（新终端）
```

### 3. 生成前端SDK

```bash
# 手动生成SDK
npm run generate-sdk

# 或者修改后端API文件，会自动重新生成
```

## 📁 项目结构

```
├── src/                    # 后端源码
│   ├── routes/            # 路由文件（包含Swagger注解）
│   ├── controllers/       # 控制器文件
│   └── config/swagger.js  # Swagger配置（自动生成openapi.json）
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── api/          # 自动生成的SDK（由openapi-generator生成）
│   │   ├── services/     # API客户端封装
│   │   └── App.vue       # 示例应用
│   ├── package.json      # 前端依赖和脚本
│   └── openapitools.json # OpenAPI生成器配置
├── scripts/               # 自动化脚本
│   ├── generate-sdk.js   # SDK生成脚本
│   ├── sync-api.js       # API同步监听脚本
│   └── start-mock.js     # Mock服务器启动脚本
├── openapi.json          # 自动生成的API规范
└── docs/                 # 文档目录
    └── openapi.json      # API规范备份
```

## 🔄 工作流程

### 1. 后端API开发
1. 在 `src/routes/` 或 `src/controllers/` 中编写API
2. 添加Swagger注解（JSDoc格式）
3. 启动服务时自动生成 `openapi.json`

### 2. 前端SDK自动生成
1. 检测到 `openapi.json` 变化
2. 自动运行 `openapi-generator` 生成TypeScript SDK
3. 生成的代码位于 `frontend/src/api/`

### 3. 自动同步流程
1. 修改后端API文件
2. `sync-api.js` 监听文件变化
3. 自动重新生成 `openapi.json`
4. 自动重新生成前端SDK
5. 前端类型定义和API调用自动更新

## 🎭 Mock模式

### 启用Mock模式

1. 复制环境变量文件：
```bash
cd frontend
cp .env.example .env
```

2. 修改 `.env` 文件：
```env
VITE_USE_MOCK=true
```

3. 启动Mock服务器：
```bash
npm run start-mock
```

### Mock功能特性
- 基于OpenAPI规范自动生成Mock数据
- 支持动态响应
- 可配置延迟时间
- 提供管理界面：http://localhost:4010/__admin/docs

## 🛠️ 配置说明

### 后端配置

#### Swagger配置 (`src/config/swagger.js`)
```javascript
// 自动生成openapi.json的配置
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API文档',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '开发服务器',
    },
  ],
};
```

### 前端配置

#### OpenAPI生成器配置 (`frontend/openapitools.json`)
```json
{
  "generator-cli": {
    "version": "7.0.1",
    "generators": {
      "typescript-axios": {
        "generatorName": "typescript-axios",
        "output": "./src/api",
        "inputSpec": "../openapi.json",
        "additionalProperties": {
          "supportsES6": true,
          "withInterfaces": true,
          "modelPropertyNaming": "camelCase"
        }
      }
    }
  }
}
```

#### API客户端配置 (`frontend/src/services/apiClient.js`)
```javascript
// 支持Mock模式切换
const mockStatus = getMockStatus();
const config = new Configuration({
  basePath: mockStatus.enabled ? mockStatus.baseURL : 'http://localhost:3000',
});
```

## 📝 使用示例

### 1. 添加新的API接口

在 `src/routes/userRoutes.js` 中添加：

```javascript
/**
 * @swagger
 * /api/users/{id}/profile:
 *   get:
 *     summary: 获取用户详细信息
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 用户详细信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id/profile', userController.getUserProfile);
```

### 2. 前端自动获得新的API方法

保存文件后，前端会自动生成新的API方法：

```javascript
// 自动生成的代码 (frontend/src/api/)
import { DefaultApi } from './api';

const api = new DefaultApi();
const userProfile = await api.getUserProfile(userId);
```

### 3. 在Vue组件中使用

```vue
<template>
  <div>
    <h1>{{ user.username }}</h1>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
import { apiClient } from '@/services/apiClient';

export default {
  data() {
    return {
      user: null
    };
  },
  async mounted() {
    // 使用自动生成的API方法
    this.user = await apiClient.getUserById(1);
  }
};
</script>
```

## 🔧 自动化脚本说明

### 1. SDK生成脚本 (`scripts/generate-sdk.js`)
- 检查 `openapi.json` 是否存在
- 安装前端依赖
- 运行 `openapi-generator` 生成SDK
- 提供详细的成功/失败信息

### 2. API同步脚本 (`scripts/sync-api.js`)
- 监听 `src/routes/` 和 `src/controllers/` 目录
- 检测文件变化（增加、修改、删除）
- 自动重新生成 `openapi.json`
- 自动重新生成前端SDK
- 防抖处理，避免频繁重新生成

### 3. Mock服务器脚本 (`scripts/start-mock.js`)
- 基于 `openapi.json` 启动Mock服务器
- 使用 `@stoplight/prism-cli`
- 支持动态Mock数据生成
- 提供管理界面

## 🎯 核心优势

### 1. 零手动维护
- ✅ 不需要手动编写API封装代码
- ✅ 不需要手动维护类型定义
- ✅ 不需要手动更新API文档
- ✅ 接口变更时自动同步所有相关代码

### 2. 开发效率提升
- ✅ 后端开发者只需关注业务逻辑和Swagger注解
- ✅ 前端开发者直接使用类型安全的API方法
- ✅ Mock模式支持前后端并行开发
- ✅ 实时监听，无需手动触发更新

### 3. 代码质量保证
- ✅ TypeScript类型安全
- ✅ 自动生成的代码遵循最佳实践
- ✅ 统一的错误处理和拦截器
- ✅ 完整的API文档和示例

### 4. 团队协作优化
- ✅ 前后端接口契约自动同步
- ✅ 减少沟通成本和理解偏差
- ✅ 支持多环境配置（开发、测试、生产）
- ✅ 版本控制友好

## 🚨 注意事项

1. **Swagger注解规范**：确保后端API有完整的Swagger注解
2. **文件监听**：`sync-api.js` 需要保持运行状态
3. **依赖安装**：确保安装了所有必要的依赖
4. **端口冲突**：确保3000（后端）、4010（Mock）端口可用
5. **环境变量**：正确配置 `.env` 文件

## 🔍 故障排除

### 1. SDK生成失败
```bash
# 检查openapi.json是否存在
ls -la openapi.json

# 手动生成SDK
npm run generate-sdk

# 检查前端依赖
cd frontend && npm install
```

### 2. API监听不工作
```bash
# 检查监听脚本是否运行
npm run sync-api

# 检查文件权限
ls -la src/routes/ src/controllers/
```

### 3. Mock服务器启动失败
```bash
# 安装prism-cli
npm install -g @stoplight/prism-cli

# 手动启动Mock服务器
npx @stoplight/prism-cli mock openapi.json --port 4010
```

## 📚 相关资源

- [OpenAPI规范](https://swagger.io/specification/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)
- [Prism Mock Server](https://stoplight.io/open-source/prism)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License