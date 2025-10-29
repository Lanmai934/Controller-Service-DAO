<template>
  <div class="about">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于项目</span>
        </div>
      </template>
      
      <div class="about-content">
        <div class="project-info">
          <h2>🏗️ 项目架构</h2>
          <p>这是一个前后端分离的现代化 Web 应用项目。</p>
          
          <el-row :gutter="20" class="architecture">
            <el-col :span="12">
              <el-card shadow="hover" class="tech-card">
                <h3>🎨 前端技术栈</h3>
                <ul>
                  <li><strong>Vue.js 3</strong> - 渐进式 JavaScript 框架</li>
                  <li><strong>Vite</strong> - 快速构建工具</li>
                  <li><strong>Element Plus</strong> - Vue 3 组件库</li>
                  <li><strong>Vue Router</strong> - 官方路由管理器</li>
                  <li><strong>Pinia</strong> - 状态管理</li>
                  <li><strong>Axios</strong> - HTTP 客户端</li>
                  <li><strong>TypeScript</strong> - 类型安全</li>
                </ul>
              </el-card>
            </el-col>
            
            <el-col :span="12">
              <el-card shadow="hover" class="tech-card">
                <h3>⚙️ 后端技术栈</h3>
                <ul>
                  <li><strong>Node.js</strong> - JavaScript 运行时</li>
                  <li><strong>Express.js</strong> - Web 应用框架</li>
                  <li><strong>MySQL</strong> - 关系型数据库</li>
                  <li><strong>Swagger</strong> - API 文档生成</li>
                  <li><strong>JWT</strong> - 身份验证</li>
                  <li><strong>Helmet</strong> - 安全中间件</li>
                  <li><strong>CORS</strong> - 跨域资源共享</li>
                </ul>
              </el-card>
            </el-col>
          </el-row>
          
          <div class="features-section">
            <h3>✨ 项目特性</h3>
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="feature-item">
                  <el-icon size="24" color="#409eff"><Connection /></el-icon>
                  <h4>前后端分离</h4>
                  <p>独立开发、部署和扩展</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="feature-item">
                  <el-icon size="24" color="#67c23a"><Document /></el-icon>
                  <h4>API 文档</h4>
                  <p>自动生成的 Swagger 文档</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="feature-item">
                  <el-icon size="24" color="#e6a23c"><Tools /></el-icon>
                  <h4>开发工具</h4>
                  <p>热重载、类型检查、代码格式化</p>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <div class="project-structure">
            <h3>📁 项目结构</h3>
            <el-card class="structure-card">
              <pre class="structure-tree">
Controller-Service-DAO/
├── backend/                 # 后端 API 服务
│   ├── src/                # 源代码
│   │   ├── controllers/    # 控制器层
│   │   ├── services/       # 业务逻辑层
│   │   ├── dao/           # 数据访问层
│   │   ├── models/        # 数据模型
│   │   └── routes/        # 路由定义
│   ├── database/          # 数据库脚本
│   └── package.json       # 后端依赖
│
├── frontend-app/          # 前端应用
│   ├── src/              # 源代码
│   │   ├── views/        # 页面组件
│   │   ├── components/   # 通用组件
│   │   ├── services/     # API 服务
│   │   └── router/       # 路由配置
│   └── package.json      # 前端依赖
│
└── docs/                 # 项目文档
              </pre>
            </el-card>
          </div>
          
          <div class="version-info">
            <h3>📋 版本信息</h3>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="项目版本">1.0.0</el-descriptions-item>
              <el-descriptions-item label="Node.js">{{ nodeVersion }}</el-descriptions-item>
              <el-descriptions-item label="Vue.js">3.x</el-descriptions-item>
              <el-descriptions-item label="构建时间">{{ buildTime }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Connection, Document, Tools } from '@element-plus/icons-vue'

const nodeVersion = ref(process.version || 'Unknown')
const buildTime = ref(new Date().toLocaleString())
</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  font-size: 1.2rem;
  font-weight: bold;
}

.about-content {
  padding: 20px 0;
}

.project-info h2 {
  color: #409eff;
  margin-bottom: 20px;
  text-align: center;
}

.architecture {
  margin: 30px 0;
}

.tech-card {
  height: 100%;
}

.tech-card h3 {
  color: #303133;
  margin-bottom: 15px;
}

.tech-card ul {
  list-style: none;
  padding: 0;
}

.tech-card li {
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tech-card li:last-child {
  border-bottom: none;
}

.features-section {
  margin: 40px 0;
}

.features-section h3 {
  color: #303133;
  margin-bottom: 20px;
  text-align: center;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-item h4 {
  margin: 10px 0;
  color: #303133;
}

.feature-item p {
  color: #606266;
  font-size: 14px;
}

.project-structure {
  margin: 40px 0;
}

.project-structure h3 {
  color: #303133;
  margin-bottom: 20px;
}

.structure-card {
  background: #f8f9fa;
}

.structure-tree {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
  white-space: pre;
  overflow-x: auto;
}

.version-info {
  margin: 40px 0;
}

.version-info h3 {
  color: #303133;
  margin-bottom: 20px;
}
</style>