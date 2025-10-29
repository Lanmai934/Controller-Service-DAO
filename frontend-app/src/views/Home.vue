<template>
  <div class="home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎使用 Frontend App</span>
        </div>
      </template>
      
      <div class="welcome-content">
        <h2>🎉 前后端分离架构</h2>
        <p>这是一个基于 Vue.js 的前端应用，与 Express.js 后端 API 完全分离。</p>
        
        <div class="features">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <div class="feature">
                  <h3>🚀 现代化技术栈</h3>
                  <p>Vue 3 + Vite + Element Plus</p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <div class="feature">
                  <h3>🔗 API 集成</h3>
                  <p>自动生成的 TypeScript SDK</p>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <div class="feature">
                  <h3>📱 响应式设计</h3>
                  <p>适配各种设备屏幕</p>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <div class="api-status">
          <h3>API 服务状态</h3>
          <el-button @click="checkApiStatus" :loading="loading" type="primary">
            检查后端连接
          </el-button>
          <div v-if="apiStatus" class="status-result">
            <el-alert
              :title="apiStatus.message"
              :type="apiStatus.success ? 'success' : 'error'"
              :description="apiStatus.details"
              show-icon
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { apiClient } from '../services/apiClient'

const loading = ref(false)
const apiStatus = ref(null)

const checkApiStatus = async () => {
  loading.value = true
  try {
    const response = await apiClient.get('/health')
    apiStatus.value = {
      success: true,
      message: 'API 连接成功',
      details: `服务器运行时间: ${Math.round(response.data.uptime)}秒`
    }
    ElMessage.success('后端 API 连接正常')
  } catch (error) {
    apiStatus.value = {
      success: false,
      message: 'API 连接失败',
      details: error.message || '无法连接到后端服务器'
    }
    ElMessage.error('无法连接到后端 API')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 1.2rem;
  font-weight: bold;
}

.welcome-content {
  text-align: center;
}

.welcome-content h2 {
  color: #409eff;
  margin-bottom: 20px;
}

.features {
  margin: 40px 0;
}

.feature {
  text-align: center;
  padding: 20px;
}

.feature h3 {
  margin-bottom: 10px;
  color: #303133;
}

.api-status {
  margin-top: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.status-result {
  margin-top: 20px;
}
</style>