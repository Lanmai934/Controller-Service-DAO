/**
 * Mock配置文件
 * 支持在开发环境中切换到Mock模式
 */

// Mock服务器配置
export const MOCK_CONFIG = {
  // Mock服务器地址
  baseURL: import.meta.env.VITE_MOCK_BASE_URL || 'http://localhost:4010',
  
  // 是否启用Mock模式
  enabled: import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true',
  
  // Mock延迟时间（毫秒）
  delay: 500,
  
  // Mock响应配置
  responses: {
    // 用户相关Mock数据
    users: {
      list: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          username: 'user1',
          email: 'user1@example.com',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        }
      ],
      single: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    },
    
    // 认证相关Mock数据
    auth: {
      login: {
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com'
        }
      },
      register: {
        message: '用户注册成功',
        user: {
          id: 3,
          username: 'newuser',
          email: 'newuser@example.com'
        }
      }
    }
  }
};

/**
 * 创建Mock拦截器
 */
export function createMockInterceptor(apiClient) {
  if (!MOCK_CONFIG.enabled) {
    return;
  }
  
  console.log('🎭 Mock模式已启用');
  
  // 请求拦截器 - 重定向到Mock服务器
  apiClient.interceptors.request.use(
    (config) => {
      // 将请求重定向到Mock服务器
      config.baseURL = MOCK_CONFIG.baseURL;
      
      console.log(`🎭 Mock请求: ${config.method?.toUpperCase()} ${config.url}`);
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // 响应拦截器 - 添加Mock延迟
  apiClient.interceptors.response.use(
    async (response) => {
      // 添加Mock延迟
      if (MOCK_CONFIG.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.delay));
      }
      
      console.log(`🎭 Mock响应: ${response.status} ${response.config.url}`);
      
      return response;
    },
    (error) => {
      console.error('🎭 Mock错误:', error.message);
      return Promise.reject(error);
    }
  );
}

/**
 * 获取Mock状态信息
 */
export function getMockStatus() {
  return {
    enabled: MOCK_CONFIG.enabled,
    baseURL: MOCK_CONFIG.baseURL,
    delay: MOCK_CONFIG.delay,
    env: import.meta.env.MODE,
    useMock: import.meta.env.VITE_USE_MOCK
  };
}