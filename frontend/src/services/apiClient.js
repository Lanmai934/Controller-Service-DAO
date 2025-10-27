import axios from 'axios';
import { createMockInterceptor, getMockStatus } from './mockConfig';
import { Api } from '../api/Api'

/**
 * API客户端配置
 * 自动使用生成的SDK，无需手动编写接口封装
 */
class ApiClient {
  constructor() {
    // 获取Mock状态
    const mockStatus = getMockStatus();
    
    const baseURL = mockStatus.enabled ? mockStatus.baseURL : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');
    
    this.api = new Api({
      baseURL: baseURL,
    })
    
    // 创建axios实例用于拦截器
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
    
    // 初始化Mock拦截器
    createMockInterceptor(this.axiosInstance);
    
    this.setupInterceptors()
  }

  /**
   * 设置请求/响应拦截器
   */
  setupInterceptors() {
    // 使用axios拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 添加认证token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        console.log('🚀 API请求:', config.url, config)
        return config
      },
      (error) => {
        console.error('❌ 请求错误:', error)
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ API响应:', response.status, response.config.url)
        return response
      },
      (error) => {
        console.error('❌ 响应错误:', error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 用户相关API
   * 这些方法会自动根据OpenAPI规范生成，类型安全
   */
  get users() {
    return {
      // 获取所有用户
      getAll: () => this.api.usersList(),
      
      // 根据ID获取用户
      getById: (id) => this.api.usersDetail(id),
      
      // 创建用户
      create: (userData) => this.api.usersCreate(userData),
      
      // 更新用户
      update: (id, userData) => this.api.usersUpdate(id, userData),
      
      // 删除用户
      delete: (id) => this.api.usersDelete(id),
      
      // 用户注册
      register: (userData) => this.api.usersRegisterCreate(userData),
      
      // 用户登录
      login: (credentials) => this.api.usersLoginCreate(credentials)
    }
  }

  /**
   * 设置认证token
   */
  setAuthToken(token) {
    localStorage.setItem('token', token)
    // 重新初始化配置
    this.config = new Configuration({
      ...this.config,
      accessToken: token
    })
    this.api = new DefaultApi(this.config)
  }

  /**
   * 清除认证
   */
  clearAuth() {
    localStorage.removeItem('token')
    this.config = new Configuration({
      basePath: this.config.basePath
    })
    this.api = new DefaultApi(this.config)
  }
  
  // 获取Mock状态
  getMockStatus() {
    return getMockStatus();
  }
  
  // 切换Mock模式
  toggleMockMode() {
    const currentStatus = getMockStatus();
    // 注意：这里只是示例，实际切换需要重新初始化客户端
    console.log('当前Mock状态:', currentStatus);
    console.log('💡 要切换Mock模式，请设置环境变量 VITE_USE_MOCK=true 并重启应用');
  }
}

// 导出单例实例
export const apiClient = new ApiClient()
export default apiClient