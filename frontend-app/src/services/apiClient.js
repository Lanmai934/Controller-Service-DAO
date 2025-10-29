import { Api } from '../api/Api'
import { ElMessage } from 'element-plus'

/**
 * API客户端配置
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

/**
 * 创建API客户端实例 - 使用自动生成的SDK
 */
class ApiClientWrapper {
  constructor() {
    this.api = new Api({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    })

    // 设置拦截器
    this.setupInterceptors()
  }

  setupInterceptors() {
    // 请求拦截器
    this.api.instance.interceptors.request.use(
      (config) => {
        // 添加认证 token（如果存在）
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // 添加请求时间戳
        config.metadata = { startTime: new Date() }
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.api.instance.interceptors.response.use(
      (response) => {
        // 计算请求耗时
        const endTime = new Date()
        const duration = endTime - response.config.metadata.startTime
        
        // 在开发环境下打印请求信息
        if (import.meta.env.DEV) {
          console.log(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
        }
        
        return response
      },
      (error) => {
        // 统一错误处理
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  handleError(error) {
    let errorMessage = '请求失败'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          localStorage.removeItem('auth_token')
          // 可以在这里触发路由跳转到登录页
          break
        case 403:
          errorMessage = '权限不足'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = data?.message || `请求失败 (${status})`
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络'
    }

    // 显示错误消息
    if (ElMessage) {
      ElMessage.error(errorMessage)
    } else {
      console.error('API Error:', errorMessage)
    }
  }

  /**
   * 用户相关API - 使用自动生成的SDK方法
   */
  get users() {
    return {
      // 用户注册
      register: (userData) => this.api.usersRegisterCreate(userData),
      
      // 用户登录
      login: (credentials) => this.api.usersLoginCreate(credentials),
      
      // 获取所有用户
      getAll: () => this.api.usersDetail(),
      
      // 获取用户详情
      getById: (id) => this.api.usersDetail1(id),
      
      // 更新用户
      update: (id, userData) => this.api.usersPartialUpdate(id, userData),
      
      // 删除用户
      delete: (id) => this.api.usersDelete(id),
    }
  }
}

// 创建API客户端实例
const apiClient = new ApiClientWrapper()

/**
 * Token 管理
 */
export const tokenManager = {
  // 设置 token
  setToken(token) {
    localStorage.setItem('auth_token', token)
  },
  
  // 获取 token
  getToken() {
    return localStorage.getItem('auth_token')
  },
  
  // 移除 token
  removeToken() {
    localStorage.removeItem('auth_token')
  },
  
  // 检查是否已登录
  isAuthenticated() {
    return !!this.getToken()
  }
}

// 导出API客户端实例
export { apiClient }
export default apiClient