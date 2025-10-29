<template>
  <div id="app">
    <el-container>
      <el-header>
        <nav class="navbar">
          <div class="nav-brand">
            <h1>Frontend App</h1>
          </div>
          <div class="nav-links">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/users" class="nav-link">用户管理</router-link>
            <router-link to="/about" class="nav-link">关于</router-link>
          </div>
        </nav>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
      
      <el-footer>
        <div class="footer-content">
          <p>&copy; 2024 Frontend App - Controller Service DAO</p>
          <p>基于 Vue.js + Element Plus 构建</p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
// 这里可以添加全局逻辑
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  height: 60px;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.el-main {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.footer-content {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.footer-content p {
  margin: 5px 0;
}
</style>