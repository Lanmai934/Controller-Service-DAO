const ProductService = require('../services/productService');
const productService = new ProductService();

// 请求日志中间件
const logRequest = (req, method) => {
  const now = new Date();
  const timestamp = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
  
  console.log(`\n🛍️ === 商品API调试日志 ===`);
  console.log(`⏰ 时间: ${timestamp}.${milliseconds}`);
  console.log(`🔗 方法: ${req.method}`);
  console.log(`📍 路径: ${req.path}`);
  console.log(`🎯 控制器方法: ${method}`);
  console.log(`📋 请求参数:`, req.params);
  console.log(`🔍 查询参数:`, req.query);
  console.log(`📦 请求体:`, req.body);
  console.log(`🛍️ ==================\n`);
};

/**
 * 商品控制器
 * 负责处理商品相关的HTTP请求和响应，调用Service层处理业务逻辑
 */
class ProductController {
  /**
   * 获取所有商品
   */
  async getAllProducts(req, res) {
    logRequest(req, 'getAllProducts');
    try {
      const { page = 1, limit = 10, category, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        status,
        sortBy,
        sortOrder
      };
      
      const result = await productService.getAllProducts(options);
      
      res.json({
        success: true,
        data: result.products,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        message: '获取商品列表成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取商品列表失败',
        error: error.message
      });
    }
  }

  /**
   * 根据ID获取商品
   */
  async getProductById(req, res) {
    logRequest(req, 'getProductById');
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      res.json({
        success: true,
        data: product,
        message: '获取商品信息成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取商品信息失败',
        error: error.message
      });
    }
  }

  /**
   * 根据SKU获取商品
   */
  async getProductBySku(req, res) {
    logRequest(req, 'getProductBySku');
    try {
      const { sku } = req.params;
      const product = await productService.getProductBySku(sku);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      res.json({
        success: true,
        data: product,
        message: '获取商品信息成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取商品信息失败',
        error: error.message
      });
    }
  }

  /**
   * 根据分类获取商品
   */
  async getProductsByCategory(req, res) {
    logRequest(req, 'getProductsByCategory');
    try {
      const { category } = req.params;
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      };
      
      const result = await productService.getProductsByCategory(category, options);
      
      res.json({
        success: true,
        data: result.products,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        message: '获取分类商品成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取分类商品失败',
        error: error.message
      });
    }
  }

  /**
   * 搜索商品
   */
  async searchProducts(req, res) {
    logRequest(req, 'searchProducts');
    try {
      const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
      
      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: '搜索关键词不能为空'
        });
      }
      
      const options = {
        keyword,
        category,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page: parseInt(page),
        limit: parseInt(limit)
      };
      
      const result = await productService.searchProducts(options);
      
      res.json({
        success: true,
        data: result.products,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        },
        message: '搜索商品成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '搜索商品失败',
        error: error.message
      });
    }
  }

  /**
   * 创建新商品
   */
  async createProduct(req, res) {
    logRequest(req, 'createProduct');
    try {
      const productData = req.body;
      const newProduct = await productService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: newProduct,
        message: '创建商品成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '创建商品失败',
        error: error.message
      });
    }
  }

  /**
   * 更新商品信息
   */
  async updateProduct(req, res) {
    logRequest(req, 'updateProduct');
    try {
      const { id } = req.params;
      const productData = req.body;
      const updatedProduct = await productService.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      res.json({
        success: true,
        data: updatedProduct,
        message: '更新商品信息成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '更新商品信息失败',
        error: error.message
      });
    }
  }

  /**
   * 删除商品
   */
  async deleteProduct(req, res) {
    logRequest(req, 'deleteProduct');
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      res.json({
        success: true,
        message: '删除商品成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '删除商品失败',
        error: error.message
      });
    }
  }

  /**
   * 更新商品库存
   */
  async updateProductStock(req, res) {
    logRequest(req, 'updateProductStock');
    try {
      const { id } = req.params;
      const { stock, operation = 'set' } = req.body;
      
      if (stock === undefined || stock === null) {
        return res.status(400).json({
          success: false,
          message: '库存数量不能为空'
        });
      }
      
      const updatedProduct = await productService.updateProductStock(id, stock, operation);
      
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      res.json({
        success: true,
        data: updatedProduct,
        message: '更新商品库存成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '更新商品库存失败',
        error: error.message
      });
    }
  }

  /**
   * 批量更新商品状态
   */
  async batchUpdateProductStatus(req, res) {
    logRequest(req, 'batchUpdateProductStatus');
    try {
      const { productIds, status } = req.body;
      
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: '商品ID列表不能为空'
        });
      }
      
      if (!status) {
        return res.status(400).json({
          success: false,
          message: '商品状态不能为空'
        });
      }
      
      const result = await productService.batchUpdateProductStatus(productIds, status);
      
      res.json({
        success: true,
        data: result,
        message: '批量更新商品状态成功'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: '批量更新商品状态失败',
        error: error.message
      });
    }
  }

  /**
   * 获取商品统计信息
   */
  async getProductStats(req, res) {
    logRequest(req, 'getProductStats');
    try {
      const stats = await productService.getProductStats();
      
      res.json({
        success: true,
        data: stats,
        message: '获取商品统计信息成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取商品统计信息失败',
        error: error.message
      });
    }
  }

  /**
   * 获取热门商品
   */
  async getPopularProducts(req, res) {
    logRequest(req, 'getPopularProducts');
    try {
      const { limit = 10 } = req.query;
      const products = await productService.getPopularProducts(parseInt(limit));
      
      res.json({
        success: true,
        data: products,
        message: '获取热门商品成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取热门商品失败',
        error: error.message
      });
    }
  }

  /**
   * 获取低库存商品
   */
  async getLowStockProducts(req, res) {
    logRequest(req, 'getLowStockProducts');
    try {
      const { threshold = 10 } = req.query;
      const products = await productService.getLowStockProducts(parseInt(threshold));
      
      res.json({
        success: true,
        data: products,
        message: '获取低库存商品成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '获取低库存商品失败',
        error: error.message
      });
    }
  }
}

module.exports = new ProductController();