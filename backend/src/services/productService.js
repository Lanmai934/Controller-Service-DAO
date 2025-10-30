const ProductDao = require('../dao/productDao');
const Product = require('../models/Product');

// 服务层日志函数
const logService = (methodName, params, result = null, error = null) => {
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
  
  console.log(`\n🔧 === 商品服务层调试日志 ===`);
  console.log(`⏰ 时间: ${timestamp}.${milliseconds}`);
  console.log(`📋 服务方法: ${methodName}`);
  console.log(`📥 输入参数:`, params);
  if (error) {
    console.log(`❌ 执行结果: 错误`);
    console.log(`🚨 错误信息:`, error.message);
  } else if (result !== null) {
    console.log(`✅ 执行结果: 成功`);
    if (Array.isArray(result)) {
      console.log(`📊 返回数据: 数组，长度: ${result.length}`);
    } else {
      console.log(`📤 返回数据:`, result);
    }
  }
  console.log(`🔧 ============================\n`);
};

/**
 * 商品服务层
 * 负责处理商品相关的业务逻辑
 */
class ProductService {
  constructor() {
    this.productDao = new ProductDao();
  }

  /**
   * 获取所有商品
   * @param {Object} options 查询选项
   * @returns {Promise<Object>} 商品列表和分页信息
   */
  async getAllProducts(options = {}) {
    try {
      logService('getAllProducts', { options });
      
      const { page = 1, limit = 20, category, status, search, orderBy = 'created_at', order = 'DESC' } = options;
      const offset = (page - 1) * limit;
      
      let products;
      
      if (search) {
        // 如果有搜索关键词，使用搜索方法
        products = await this.productDao.search(search);
      } else {
        // 否则使用常规查询
        products = await this.productDao.findAll({
          category,
          status,
          limit: parseInt(limit),
          offset: parseInt(offset),
          orderBy,
          order
        });
      }
      
      // 获取总数（简化版本，实际应该根据筛选条件计算）
      const allProducts = await this.productDao.findAll();
      const total = allProducts.length;
      
      const result = {
        products: products.map(product => product.toSummary()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
      
      logService('getAllProducts', { options }, result);
      return result;
    } catch (error) {
      logService('getAllProducts', { options }, null, error);
      throw error;
    }
  }

  /**
   * 根据ID获取商品详情
   * @param {number} id 商品ID
   * @returns {Promise<Object|null>} 商品详情
   */
  async getProductById(id) {
    try {
      logService('getProductById', { id });
      
      if (!id || (typeof id !== 'string' && typeof id !== 'number') || id.toString().trim() === '') {
        throw new Error('无效的商品ID');
      }
      
      const product = await this.productDao.findById(id);
      if (!product) {
        throw new Error('商品不存在');
      }
      
      const result = product.toJSON();
      logService('getProductById', { id }, result);
      return result;
    } catch (error) {
      logService('getProductById', { id }, null, error);
      throw error;
    }
  }

  /**
   * 根据SKU获取商品
   * @param {string} sku 商品SKU
   * @returns {Promise<Object|null>} 商品信息
   */
  async getProductBySku(sku) {
    try {
      logService('getProductBySku', { sku });
      
      if (!sku || sku.trim().length === 0) {
        throw new Error('SKU不能为空');
      }
      
      const product = await this.productDao.findBySku(sku.trim());
      if (!product) {
        throw new Error('商品不存在');
      }
      
      const result = product.toJSON();
      logService('getProductBySku', { sku }, result);
      return result;
    } catch (error) {
      logService('getProductBySku', { sku }, null, error);
      throw error;
    }
  }

  /**
   * 根据分类获取商品
   * @param {string} category 商品分类
   * @returns {Promise<Array>} 商品列表
   */
  async getProductsByCategory(category) {
    try {
      logService('getProductsByCategory', { category });
      
      if (!category || category.trim().length === 0) {
        throw new Error('分类不能为空');
      }
      
      const products = await this.productDao.findByCategory(category.trim());
      const result = products.map(product => product.toSummary());
      
      logService('getProductsByCategory', { category }, result);
      return result;
    } catch (error) {
      logService('getProductsByCategory', { category }, null, error);
      throw error;
    }
  }

  /**
   * 搜索商品
   * @param {string} keyword 搜索关键词
   * @returns {Promise<Array>} 商品列表
   */
  async searchProducts(keyword) {
    try {
      logService('searchProducts', { keyword });
      
      if (!keyword || keyword.trim().length === 0) {
        throw new Error('搜索关键词不能为空');
      }
      
      const products = await this.productDao.search(keyword.trim());
      const result = products.map(product => product.toSummary());
      
      logService('searchProducts', { keyword }, result);
      return result;
    } catch (error) {
      logService('searchProducts', { keyword }, null, error);
      throw error;
    }
  }

  /**
   * 创建新商品
   * @param {Object} productData 商品数据
   * @returns {Promise<Object>} 创建的商品
   */
  async createProduct(productData) {
    try {
      logService('createProduct', { productData });
      
      // 验证必填字段
      if (!productData.name || !productData.price || !productData.category) {
        throw new Error('商品名称、价格和分类为必填字段');
      }
      
      // 检查SKU是否已存在（如果提供了SKU）
      if (productData.sku) {
        const existingProduct = await this.productDao.findBySku(productData.sku);
        if (existingProduct) {
          throw new Error('SKU已存在');
        }
      }
      
      // 创建商品实例并验证
      const product = Product.create(productData);
      
      // 保存到数据库
      const createdProduct = await this.productDao.create(product);
      const result = createdProduct.toJSON();
      
      logService('createProduct', { productData }, result);
      return result;
    } catch (error) {
      logService('createProduct', { productData }, null, error);
      throw error;
    }
  }

  /**
   * 更新商品
   * @param {number} id 商品ID
   * @param {Object} updateData 更新数据
   * @returns {Promise<Object>} 更新后的商品
   */
  async updateProduct(id, updateData) {
    try {
      logService('updateProduct', { id, updateData });
      
      if (!id || isNaN(id)) {
        throw new Error('无效的商品ID');
      }
      
      // 检查商品是否存在
      const existingProduct = await this.productDao.findById(parseInt(id));
      if (!existingProduct) {
        throw new Error('商品不存在');
      }
      
      // 如果更新SKU，检查是否与其他商品冲突
      if (updateData.sku && updateData.sku !== existingProduct.sku) {
        const skuProduct = await this.productDao.findBySku(updateData.sku);
        if (skuProduct && skuProduct.id !== parseInt(id)) {
          throw new Error('SKU已存在');
        }
      }
      
      // 验证更新数据
      const tempProduct = new Product({ ...existingProduct.toJSON(), ...updateData });
      const validation = tempProduct.validate();
      if (!validation.isValid) {
        throw new Error(`数据验证失败: ${validation.errors.join(', ')}`);
      }
      
      // 执行更新
      const updatedProduct = await this.productDao.update(parseInt(id), updateData);
      const result = updatedProduct ? updatedProduct.toJSON() : null;
      
      logService('updateProduct', { id, updateData }, result);
      return result;
    } catch (error) {
      logService('updateProduct', { id, updateData }, null, error);
      throw error;
    }
  }

  /**
   * 删除商品
   * @param {number} id 商品ID
   * @returns {Promise<boolean>} 删除是否成功
   */
  async deleteProduct(id) {
    try {
      logService('deleteProduct', { id });
      
      if (!id || (typeof id !== 'string' && typeof id !== 'number') || id.toString().trim() === '') {
        throw new Error('无效的商品ID');
      }
      
      // 检查商品是否存在
      const existingProduct = await this.productDao.findById(id);
      if (!existingProduct) {
        throw new Error('商品不存在');
      }
      
      // 执行删除
      const success = await this.productDao.delete(id);
      
      logService('deleteProduct', { id }, { success });
      return success;
    } catch (error) {
      logService('deleteProduct', { id }, null, error);
      throw error;
    }
  }

  /**
   * 更新商品库存
   * @param {number} id 商品ID
   * @param {number} quantity 库存变化量
   * @returns {Promise<Object>} 更新后的商品
   */
  async updateProductStock(id, quantity) {
    try {
      logService('updateProductStock', { id, quantity });
      
      if (!id || (typeof id !== 'string' && typeof id !== 'number') || id.toString().trim() === '') {
        throw new Error('无效的商品ID');
      }
      
      if (typeof quantity !== 'number') {
        throw new Error('库存数量必须是数字');
      }
      
      const updatedProduct = await this.productDao.updateStock(id, quantity);
      const result = updatedProduct ? updatedProduct.toJSON() : null;
      
      logService('updateProductStock', { id, quantity }, result);
      return result;
    } catch (error) {
      logService('updateProductStock', { id, quantity }, null, error);
      throw error;
    }
  }

  /**
   * 批量更新商品状态
   * @param {Array} ids 商品ID数组
   * @param {string} status 新状态
   * @returns {Promise<Object>} 更新结果
   */
  async batchUpdateStatus(ids, status) {
    try {
      logService('batchUpdateStatus', { ids, status });
      
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('商品ID列表不能为空');
      }
      
      if (!['active', 'inactive', 'discontinued'].includes(status)) {
        throw new Error('无效的商品状态');
      }
      
      const affectedRows = await this.productDao.batchUpdateStatus(ids, status);
      const result = { affectedRows, status };
      
      logService('batchUpdateStatus', { ids, status }, result);
      return result;
    } catch (error) {
      logService('batchUpdateStatus', { ids, status }, null, error);
      throw error;
    }
  }

  /**
   * 获取商品统计信息
   * @returns {Promise<Object>} 统计信息
   */
  async getProductStats() {
    try {
      logService('getProductStats', {});
      
      const stats = await this.productDao.getStats();
      
      logService('getProductStats', {}, stats);
      return stats;
    } catch (error) {
      logService('getProductStats', {}, null, error);
      throw error;
    }
  }

  /**
   * 获取低库存商品
   * @param {number} threshold 库存阈值，默认10
   * @returns {Promise<Array>} 低库存商品列表
   */
  async getLowStockProducts(threshold = 10) {
    try {
      logService('getLowStockProducts', { threshold });
      
      const allProducts = await this.productDao.findAll();
      const lowStockProducts = allProducts
        .filter(product => product.stock < threshold)
        .map(product => product.toSummary());
      
      logService('getLowStockProducts', { threshold }, lowStockProducts);
      return lowStockProducts;
    } catch (error) {
      logService('getLowStockProducts', { threshold }, null, error);
      throw error;
    }
  }

  /**
   * 获取热门商品（按创建时间排序，模拟热门逻辑）
   * @param {number} limit 返回数量限制
   * @returns {Promise<Array>} 热门商品列表
   */
  async getPopularProducts(limit = 10) {
    try {
      logService('getPopularProducts', { limit });
      
      const products = await this.productDao.findAll({
        status: 'active',
        limit: parseInt(limit),
        orderBy: 'created_at',
        order: 'DESC'
      });
      
      const result = products.map(product => product.toSummary());
      
      logService('getPopularProducts', { limit }, result);
      return result;
    } catch (error) {
      logService('getPopularProducts', { limit }, null, error);
      throw error;
    }
  }
}

module.exports = ProductService;