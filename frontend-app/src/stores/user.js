import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient, { tokenManager } from '../services/apiClient'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const userCount = computed(() => users.value.length)
  const isLoggedIn = computed(() => !!currentUser.value)

  // 操作方法
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.users.getAll()
      users.value = response.data.data || []
      return users.value
    } catch (err) {
      error.value = err.message
      ElMessage.error('获取用户列表失败: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.users.getById(id)
      return response.data.data
    } catch (err) {
      error.value = err.message
      ElMessage.error('获取用户信息失败: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.users.register(userData)
      const newUser = response.data.data
      users.value.push(newUser)
      ElMessage.success('用户创建成功')
      return newUser
    } catch (err) {
      error.value = err.message
      ElMessage.error('创建用户失败: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.users.update(id, userData)
      const updatedUser = response.data.data
      
      // 更新本地用户列表
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      
      // 如果更新的是当前用户，也更新当前用户信息
      if (currentUser.value && currentUser.value.id === id) {
        currentUser.value = updatedUser
      }
      
      ElMessage.success('用户更新成功')
      return updatedUser
    } catch (err) {
      error.value = err.message
      ElMessage.error('更新用户失败: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await apiClient.users.delete(id)
      
      // 从本地用户列表中移除
      users.value = users.value.filter(user => user.id !== id)
      
      ElMessage.success('用户删除成功')
    } catch (err) {
      error.value = err.message
      ElMessage.error('删除用户失败: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentUser = (user) => {
    currentUser.value = user
  }

  const logout = () => {
    currentUser.value = null
    tokenManager.removeToken()
    ElMessage.success('已退出登录')
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.users.login(credentials)
      const { token, user } = response.data.data
      
      // 保存token和用户信息
      tokenManager.setToken(token)
      currentUser.value = user
      
      ElMessage.success('登录成功')
      return { token, user }
    } catch (err) {
      error.value = err.message
      ElMessage.error('登录失败: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearUsers = () => {
    users.value = []
  }

  // 搜索用户
  const searchUsers = (query) => {
    if (!query) return users.value
    
    const lowerQuery = query.toLowerCase()
    return users.value.filter(user => 
      user.name?.toLowerCase().includes(lowerQuery) ||
      user.email?.toLowerCase().includes(lowerQuery) ||
      user.username?.toLowerCase().includes(lowerQuery)
    )
  }

  // 按角色过滤用户
  const filterUsersByRole = (role) => {
    if (!role) return users.value
    return users.value.filter(user => user.role === role)
  }

  return {
    // 状态
    users,
    currentUser,
    loading,
    error,
    
    // 计算属性
    userCount,
    isLoggedIn,
    
    // 方法
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    login,
    logout,
    clearError,
    clearUsers,
    searchUsers,
    filterUsersByRole
  }
})