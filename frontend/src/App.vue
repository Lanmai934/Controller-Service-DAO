<template>
  <div id="app">
    <header>
      <h1>🚀 前后端自动对齐示例</h1>
      <p>基于OpenAPI自动生成的SDK，无需手动编写接口封装</p>
    </header>

    <main>
      <section class="api-demo">
        <h2>📡 API调用示例</h2>
        
        <div class="controls">
          <button @click="fetchUsers" :disabled="loading">
            {{ loading ? '加载中...' : '获取用户列表' }}
          </button>
          <button @click="createUser" :disabled="loading">
            创建测试用户
          </button>
          <button @click="toggleMockMode">
            {{ mockMode ? '切换到真实API' : '切换到Mock模式' }}
          </button>
        </div>

        <div class="status">
          <p><strong>当前模式:</strong> {{ mockMode ? 'Mock模式' : '真实API' }}</p>
          <p><strong>API地址:</strong> {{ apiBaseUrl }}</p>
          <p><strong>SDK版本:</strong> 自动生成 ({{ new Date().toLocaleString() }})</p>
        </div>

        <div class="results" v-if="users.length > 0">
          <h3>👥 用户列表 ({{ users.length }})</h3>
          <div class="user-grid">
            <div v-for="user in users" :key="user.id" class="user-card">
              <h4>{{ user.name }}</h4>
              <p>📧 {{ user.email }}</p>
              <p>🎂 {{ user.age }}岁</p>
              <p>📅 {{ formatDate(user.createdAt) }}</p>
              <div class="actions">
                <button @click="updateUser(user.id)" class="btn-update">
                  更新
                </button>
                <button @click="deleteUser(user.id)" class="btn-delete">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="error" v-if="error">
          <h3>❌ 错误信息</h3>
          <pre>{{ error }}</pre>
        </div>
      </section>

      <section class="sdk-info">
        <h2>🔧 SDK自动生成信息</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>📋 OpenAPI规范</h3>
            <p>后端自动导出: <code>openapi.json</code></p>
            <p>实时同步接口变更</p>
          </div>
          <div class="info-card">
            <h3>🛠️ SDK生成</h3>
            <p>工具: OpenAPI Generator</p>
            <p>语言: TypeScript + Axios</p>
            <p>类型安全: ✅</p>
          </div>
          <div class="info-card">
            <h3>🎭 Mock服务</h3>
            <p>工具: Prism Mock Server</p>
            <p>端口: 4010</p>
            <p>自动数据生成: ✅</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import apiClient from './services/apiClient'

export default {
  name: 'App',
  setup() {
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)
    const mockMode = ref(false)
    const apiBaseUrl = ref('http://localhost:3000')

    const fetchUsers = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await apiClient.users.getAll()
        users.value = response.data.data || []
        console.log('✅ 用户数据获取成功:', users.value)
      } catch (err) {
        error.value = err.message || '获取用户失败'
        console.error('❌ 获取用户失败:', err)
      } finally {
        loading.value = false
      }
    }

    const createUser = async () => {
      loading.value = true
      error.value = null
      
      try {
        const newUser = {
          name: `测试用户${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          age: Math.floor(Math.random() * 50) + 18
        }
        
        const response = await apiClient.users.create(newUser)
        console.log('✅ 用户创建成功:', response.data)
        
        // 重新获取用户列表
        await fetchUsers()
      } catch (err) {
        error.value = err.message || '创建用户失败'
        console.error('❌ 创建用户失败:', err)
      } finally {
        loading.value = false
      }
    }

    const updateUser = async (userId) => {
      try {
        const updatedData = {
          name: `更新用户${Date.now()}`,
          age: Math.floor(Math.random() * 50) + 18
        }
        
        await apiClient.users.update(userId, updatedData)
        console.log('✅ 用户更新成功')
        await fetchUsers()
      } catch (err) {
        error.value = err.message || '更新用户失败'
        console.error('❌ 更新用户失败:', err)
      }
    }

    const deleteUser = async (userId) => {
      if (!confirm('确定要删除这个用户吗？')) return
      
      try {
        await apiClient.users.delete(userId)
        console.log('✅ 用户删除成功')
        await fetchUsers()
      } catch (err) {
        error.value = err.message || '删除用户失败'
        console.error('❌ 删除用户失败:', err)
      }
    }

    const toggleMockMode = () => {
      mockMode.value = !mockMode.value
      apiBaseUrl.value = mockMode.value ? 'http://localhost:4010' : 'http://localhost:3000'
      
      // 重新配置API客户端
      apiClient.config.basePath = apiBaseUrl.value
      console.log(`🔄 切换到${mockMode.value ? 'Mock' : '真实'}模式:`, apiBaseUrl.value)
    }

    const formatDate = (dateString) => {
      if (!dateString) return '未知'
      return new Date(dateString).toLocaleString('zh-CN')
    }

    onMounted(() => {
      console.log('🎉 应用已启动，SDK已自动加载')
      fetchUsers()
    })

    return {
      users,
      loading,
      error,
      mockMode,
      apiBaseUrl,
      fetchUsers,
      createUser,
      updateUser,
      deleteUser,
      toggleMockMode,
      formatDate
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

main {
  display: grid;
  gap: 30px;
}

section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

h2 {
  color: #4a5568;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #4299e1;
  color: white;
}

button:hover:not(:disabled) {
  background: #3182ce;
  transform: translateY(-2px);
}

button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.btn-update {
  background: #48bb78 !important;
}

.btn-update:hover {
  background: #38a169 !important;
}

.btn-delete {
  background: #f56565 !important;
}

.btn-delete:hover {
  background: #e53e3e !important;
}

.status {
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #4299e1;
}

.status p {
  margin-bottom: 5px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.user-card h4 {
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.user-card p {
  margin-bottom: 8px;
  color: #4a5568;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.actions button {
  padding: 8px 16px;
  font-size: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
}

.info-card h3 {
  color: #2d3748;
  margin-bottom: 10px;
}

.info-card p {
  margin-bottom: 5px;
  color: #4a5568;
}

.info-card code {
  background: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

.error {
  background: #fed7d7;
  border: 1px solid #fc8181;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.error h3 {
  color: #c53030;
  margin-bottom: 10px;
}

.error pre {
  background: #fff5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  
  .user-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>