const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

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
      Product: {
        type: 'object',
        required: ['name', 'price', 'category', 'sku'],
        properties: {
          id: {
            type: 'string',
            description: '商品ID',
            example: 'prod_001'
          },
          name: {
            type: 'string',
            description: '商品名称',
            minLength: 1,
            maxLength: 200,
            example: 'iPhone 15 Pro'
          },
          description: {
            type: 'string',
            description: '商品描述',
            example: '最新款iPhone，配备A17 Pro芯片'
          },
          price: {
            type: 'number',
            minimum: 0,
            description: '商品价格',
            example: 7999.00
          },
          category: {
            type: 'string',
            description: '商品分类',
            example: '电子产品'
          },
          brand: {
            type: 'string',
            description: '商品品牌',
            example: 'Apple'
          },
          sku: {
            type: 'string',
            description: '商品SKU',
            example: 'IPH15P-128GB-BLK'
          },
          stock: {
            type: 'integer',
            minimum: 0,
            description: '库存数量',
            example: 100
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: '商品图片URL列表',
            example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'draft'],
            description: '商品状态',
            example: 'active'
          },
          weight: {
            type: 'number',
            minimum: 0,
            description: '商品重量(kg)',
            example: 0.2
          },
          dimensions: {
            type: 'object',
            properties: {
              length: {
                type: 'number',
                description: '长度(cm)'
              },
              width: {
                type: 'number',
                description: '宽度(cm)'
              },
              height: {
                type: 'number',
                description: '高度(cm)'
              }
            },
            description: '商品尺寸',
            example: { length: 14.7, width: 7.1, height: 0.8 }
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: '商品标签',
            example: ['热销', '新品', '推荐']
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
      ProductInput: {
        type: 'object',
        required: ['name', 'price', 'category', 'sku'],
        properties: {
          name: {
            type: 'string',
            description: '商品名称',
            minLength: 1,
            maxLength: 200,
            example: 'iPhone 15 Pro'
          },
          description: {
            type: 'string',
            description: '商品描述',
            example: '最新款iPhone，配备A17 Pro芯片'
          },
          price: {
            type: 'number',
            minimum: 0,
            description: '商品价格',
            example: 7999.00
          },
          category: {
            type: 'string',
            description: '商品分类',
            example: '电子产品'
          },
          brand: {
            type: 'string',
            description: '商品品牌',
            example: 'Apple'
          },
          sku: {
            type: 'string',
            description: '商品SKU',
            example: 'IPH15P-128GB-BLK'
          },
          stock: {
            type: 'integer',
            minimum: 0,
            description: '库存数量',
            example: 100
          },
          images: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: '商品图片URL列表',
            example: ['https://example.com/image1.jpg']
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'draft'],
            description: '商品状态',
            example: 'active'
          },
          weight: {
            type: 'number',
            minimum: 0,
            description: '商品重量(kg)',
            example: 0.2
          },
          dimensions: {
            type: 'object',
            properties: {
              length: {
                type: 'number',
                description: '长度(cm)'
              },
              width: {
                type: 'number',
                description: '宽度(cm)'
              },
              height: {
                type: 'number',
                description: '高度(cm)'
              }
            },
            description: '商品尺寸'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: '商品标签',
            example: ['热销', '新品']
          }
        }
      },
      ProductStats: {
        type: 'object',
        properties: {
          totalProducts: {
            type: 'integer',
            description: '商品总数',
            example: 150
          },
          activeProducts: {
            type: 'integer',
            description: '上架商品数',
            example: 120
          },
          inactiveProducts: {
            type: 'integer',
            description: '下架商品数',
            example: 20
          },
          draftProducts: {
            type: 'integer',
            description: '草稿商品数',
            example: 10
          },
          totalValue: {
            type: 'number',
            description: '商品总价值',
            example: 1250000.00
          },
          averagePrice: {
            type: 'number',
            description: '平均价格',
            example: 8333.33
          },
          lowStockCount: {
            type: 'integer',
            description: '低库存商品数',
            example: 5
          },
          categories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: {
                  type: 'string',
                  description: '分类名称'
                },
                count: {
                  type: 'integer',
                  description: '商品数量'
                }
              }
            },
            description: '分类统计',
            example: [
              { category: '电子产品', count: 50 },
              { category: '服装', count: 30 }
            ]
          }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            description: '当前页码',
            example: 1
          },
          limit: {
            type: 'integer',
            description: '每页数量',
            example: 10
          },
          total: {
            type: 'integer',
            description: '总记录数',
            example: 100
          },
          totalPages: {
            type: 'integer',
            description: '总页数',
            example: 10
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

/**
 * 自动生成并导出OpenAPI规范文件
 * 用于前端SDK自动生成和其他工具集成
 */
function generateOpenApiFile() {
  try {
    const outputPath = path.join(process.cwd(), 'openapi.json');
    const openApiContent = JSON.stringify(swaggerSpec, null, 2);
    
    fs.writeFileSync(outputPath, openApiContent, 'utf8');
    console.log(`✅ OpenAPI规范已生成: ${outputPath}`);
    
    // 同时生成到docs目录，便于版本管理
    const docsPath = path.join(process.cwd(), 'docs', 'openapi.json');
    const docsDir = path.dirname(docsPath);
    
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    fs.writeFileSync(docsPath, openApiContent, 'utf8');
    console.log(`📚 OpenAPI文档已保存: ${docsPath}`);
    
    return outputPath;
  } catch (error) {
    console.error('❌ 生成OpenAPI文件失败:', error.message);
    throw error;
  }
}

// 在模块加载时自动生成OpenAPI文件
// 暂时禁用自动生成以避免频繁重启
// if (process.env.NODE_ENV !== 'test') {
//   generateOpenApiFile();
// }

module.exports = {
  swaggerSpec,
  swaggerUi,
  generateOpenApiFile
};