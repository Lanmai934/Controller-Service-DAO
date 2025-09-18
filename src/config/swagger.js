const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Swagger配置
 * 定义API文档的基本信息和选项
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Controller-Service-DAO API',
    version: '1.0.0',
    description: 'Express后台服务API文档，采用经典三层架构 (Controller-Service-DAO)',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '开发环境服务器'
    }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          id: {
            type: 'integer',
            description: '用户ID',
            example: 1
          },
          name: {
            type: 'string',
            description: '用户姓名',
            minLength: 2,
            maxLength: 50,
            example: '张三'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '用户邮箱',
            example: 'zhangsan@example.com'
          },
          age: {
            type: 'integer',
            minimum: 0,
            maximum: 150,
            description: '用户年龄',
            example: 25
          },
          phone: {
            type: 'string',
            description: '手机号码',
            example: '13800138000'
          },
          address: {
            type: 'string',
            description: '用户地址',
            example: '北京市朝阳区'
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'deleted'],
            description: '用户状态',
            example: 'active'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: '创建时间',
            example: '2024-01-01T00:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: '更新时间',
            example: '2024-01-01T00:00:00.000Z'
          }
        }
      },
      UserInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: {
            type: 'string',
            description: '用户姓名',
            minLength: 2,
            maxLength: 50,
            example: '张三'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '用户邮箱',
            example: 'zhangsan@example.com'
          },
          age: {
            type: 'integer',
            minimum: 0,
            maximum: 150,
            description: '用户年龄',
            example: 25
          },
          phone: {
            type: 'string',
            description: '手机号码',
            example: '13800138000'
          },
          address: {
            type: 'string',
            description: '用户地址',
            example: '北京市朝阳区'
          }
        }
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            description: '用户姓名',
            minLength: 2,
            maxLength: 50,
            example: '张三'
          },
          email: {
            type: 'string',
            format: 'email',
            description: '用户邮箱',
            example: 'zhangsan@example.com'
          },
          password: {
            type: 'string',
            description: '用户密码',
            minLength: 6,
            maxLength: 50,
            example: '123456'
          },
          age: {
            type: 'integer',
            minimum: 0,
            maximum: 150,
            description: '用户年龄',
            example: 25
          },
          phone: {
            type: 'string',
            description: '手机号码',
            example: '13800138000'
          },
          address: {
            type: 'string',
            description: '用户地址',
            example: '北京市朝阳区'
          }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: '用户邮箱',
            example: 'zhangsan@example.com'
          },
          password: {
            type: 'string',
            description: '用户密码',
            example: '123456'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          user: {
            $ref: '#/components/schemas/User'
          },
          token: {
            type: 'string',
            description: 'JWT访问令牌',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: '请求是否成功',
            example: true
          },
          message: {
            type: 'string',
            description: '响应消息',
            example: '操作成功'
          },
          data: {
            description: '响应数据'
          },
          error: {
            type: 'string',
            description: '错误信息'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: '错误消息',
            example: '操作失败'
          },
          error: {
            type: 'string',
            description: '详细错误信息'
          }
        }
      }
    }
  }
};

// Swagger选项配置
const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.js', // 路由文件路径
    './src/controllers/*.js' // 控制器文件路径
  ]
};

// 生成Swagger规范
const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi
};