const database = require('../config/database');
const Product = require('../models/Product');

// 数据访问层日志函数
const logDao = (methodName, params, result = null, error = null) => {
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
  
  console.log(`\n💾 === 商品数据访问层调试日志 ===`);
  console.log(`⏰ 时间: ${timestamp}.${milliseconds}`);
  console.log(`🗄️ DAO方法: ${methodName}`);
  console.log(`📥 输入参数:`, params);
  if (error) {
    console.log(`❌ 执行结果: 数据库错误`);
    console.log(`🚨 错误信息:`, error.message);
  } else if (result !== null) {
    console.log(`✅ 执行结果: 成功`);
    if (Array.isArray(result)) {
      console.log(`📊 返回数据: 数组，长度: ${result.length}`);
      if (result.length > 0) {
        console.log(`📄 首条记录:`, result[0]);
      }
    } else {
      console.log(`📤 返回数据:`, result);
    }
  }
  console.log(`💾 ===============================\n`);
};

/**
 * 商品数据访问层 (DAO)
 * 负责与数据库的直接交互
 */
class ProductDao {
  constructor() {
    this.db = database;
  }

  /**
   * 获取所有商品
   * @param {Object} options 查询选项
   * @returns {Promise<Array>} 商品列表
   */
  async findAll(options = {}) {
    try {
      const { category, status, limit, offset, orderBy = 'created_at', order = 'DESC' } = options;
      
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category) {
        sql += ' AND category = ?';
        params.push(category);
      }

      if (status) {
        sql += ' AND status = ?';
        params.push(status);
      }

      sql += ` ORDER BY ${orderBy} ${order}`;

      if (limit) {
        const limitValue = parseInt(limit);
        if (offset !== undefined && offset !== null) {
          const offsetValue = parseInt(offset);
          sql += ` LIMIT ${offsetValue}, ${limitValue}`;
        } else {
          sql += ` LIMIT ${limitValue}`;
        }
      }

      logDao('findAll', { options });
      console.log('🔍 执行SQL:', sql);
      console.log('📝 参数:', params);
      const result = await this.db.execute(sql, params);
      const rows = Array.isArray(result) ? result[0] : result.rows || [];
      
      // 转换为Product实例
      const products = rows.map(row => Product.fromRow(row));
      logDao('findAll', { options }, products);
      return products;
    } catch (error) {
      logDao('findAll', { options }, null, error);
      console.error('获取所有商品失败:', error);
      throw new Error('获取商品列表失败');
    }
  }

  /**
   * 根据ID查找商品
   * @param {number} id 商品ID
   * @returns {Promise<Product|null>} 商品对象或null
   */
  async findById(id) {
    try {
      logDao('findById', { id });
      const result = await this.db.execute('SELECT * FROM products WHERE id = ?', [id]);
      const rows = Array.isArray(result) ? result[0] : result.rows || [];
      const productRow = rows[0] || null;
      
      const product = productRow ? Product.fromRow(productRow) : null;
      logDao('findById', { id }, product);
      return product;
    } catch (error) {
      logDao('findById', { id }, null, error);
      console.error('根据ID查找商品失败:', error);
      throw new Error('查找商品失败');
    }
  }

  /**
   * 根据SKU查找商品
   * @param {string} sku 商品SKU
   * @returns {Promise<Product|null>} 商品对象或null
   */
  async findBySku(sku) {
    try {
      logDao('findBySku', { sku });
      const result = await this.db.execute('SELECT * FROM products WHERE sku = ?', [sku]);
      const rows = Array.isArray(result) ? result[0] : result.rows || [];
      const productRow = rows[0] || null;
      
      const product = productRow ? Product.fromRow(productRow) : null;
      logDao('findBySku', { sku }, product);
      return product;
    } catch (error) {
      logDao('findBySku', { sku }, null, error);
      console.error('根据SKU查找商品失败:', error);
      throw new Error('查找商品失败');
    }
  }

  /**
   * 根据分类查找商品
   * @param {string} category 商品分类
   * @returns {Promise<Array>} 商品列表
   */
  async findByCategory(category) {
    try {
      logDao('findByCategory', { category });
      const result = await this.db.execute(
        'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC', 
        [category]
      );
      const rows = Array.isArray(result) ? result[0] : result.rows || [];
      
      const products = rows.map(row => Product.fromRow(row));
      logDao('findByCategory', { category }, products);
      return products;
    } catch (error) {
      logDao('findByCategory', { category }, null, error);
      console.error('根据分类查找商品失败:', error);
      throw new Error('查找商品失败');
    }
  }

  /**
   * 搜索商品
   * @param {string} keyword 搜索关键词
   * @returns {Promise<Array>} 商品列表
   */
  async search(keyword) {
    try {
      logDao('search', { keyword });
      const searchTerm = `%${keyword}%`;
      const result = await this.db.execute(
        'SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR brand LIKE ? ORDER BY created_at DESC',
        [searchTerm, searchTerm, searchTerm]
      );
      const rows = Array.isArray(result) ? result[0] : result.rows || [];
      
      const products = rows.map(row => Product.fromRow(row));
      logDao('search', { keyword }, products);
      return products;
    } catch (error) {
      logDao('search', { keyword }, null, error);
      console.error('搜索商品失败:', error);
      throw new Error('搜索商品失败');
    }
  }

  /**
   * 创建新商品
   * @param {Product} product 商品对象
   * @returns {Promise<Product>} 创建的商品对象
   */
  async create(product) {
    try {
      logDao('create', { product: product.toJSON() });
      
      const sql = `
        INSERT INTO products (
          name, description, price, category, brand, sku, stock, 
          images, status, weight, dimensions, tags, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        product.name,
        product.description,
        product.price,
        product.category,
        product.brand,
        product.sku,
        product.stock,
        JSON.stringify(product.images),
        product.status,
        product.weight,
        JSON.stringify(product.dimensions),
        JSON.stringify(product.tags),
        product.createdAt,
        product.updatedAt
      ];

      const result = await this.db.execute(sql, params);
      const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;
      
      // 返回创建的商品
      const createdProduct = await this.findById(insertId);
      logDao('create', { product: product.toJSON() }, createdProduct);
      return createdProduct;
    } catch (error) {
      logDao('create', { product: product.toJSON() }, null, error);
      console.error('创建商品失败:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('SKU已存在');
      }
      throw new Error('创建商品失败');
    }
  }

  /**
   * 更新商品
   * @param {number} id 商品ID
   * @param {Object} updateData 更新数据
   * @returns {Promise<Product|null>} 更新后的商品对象
   */
  async update(id, updateData) {
    try {
      logDao('update', { id, updateData });
      
      const fields = [];
      const params = [];
      
      // 动态构建更新字段
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          if (['images', 'dimensions', 'tags'].includes(key)) {
            fields.push(`${key} = ?`);
            params.push(JSON.stringify(updateData[key]));
          } else {
            fields.push(`${key} = ?`);
            params.push(updateData[key]);
          }
        }
      });
      
      if (fields.length === 0) {
        throw new Error('没有要更新的字段');
      }
      
      // 添加更新时间
      fields.push('updated_at = ?');
      params.push(new Date());
      params.push(id);
      
      const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      await this.db.execute(sql, params);
      
      // 返回更新后的商品
      const updatedProduct = await this.findById(id);
      logDao('update', { id, updateData }, updatedProduct);
      return updatedProduct;
    } catch (error) {
      logDao('update', { id, updateData }, null, error);
      console.error('更新商品失败:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('SKU已存在');
      }
      throw new Error('更新商品失败');
    }
  }

  /**
   * 删除商品
   * @param {number} id 商品ID
   * @returns {Promise<boolean>} 删除是否成功
   */
  async delete(id) {
    try {
      logDao('delete', { id });
      const result = await this.db.execute('DELETE FROM products WHERE id = ?', [id]);
      const affectedRows = Array.isArray(result) ? result[0].affectedRows : result.affectedRows;
      const success = affectedRows > 0;
      logDao('delete', { id }, { success, affectedRows });
      return success;
    } catch (error) {
      logDao('delete', { id }, null, error);
      console.error('删除商品失败:', error);
      throw new Error('删除商品失败');
    }
  }

  /**
   * 更新商品库存
   * @param {number} id 商品ID
   * @param {number} quantity 库存变化量（正数增加，负数减少）
   * @returns {Promise<Product|null>} 更新后的商品对象
   */
  async updateStock(id, quantity) {
    try {
      logDao('updateStock', { id, quantity });
      
      // 先获取当前商品信息
      const product = await this.findById(id);
      if (!product) {
        throw new Error('商品不存在');
      }
      
      const newStock = product.stock + quantity;
      if (newStock < 0) {
        throw new Error('库存不足');
      }
      
      const sql = 'UPDATE products SET stock = ?, updated_at = ? WHERE id = ?';
      await this.db.execute(sql, [newStock, new Date(), id]);
      
      const updatedProduct = await this.findById(id);
      logDao('updateStock', { id, quantity }, updatedProduct);
      return updatedProduct;
    } catch (error) {
      logDao('updateStock', { id, quantity }, null, error);
      console.error('更新商品库存失败:', error);
      throw error;
    }
  }

  /**
   * 获取商品统计信息
   * @returns {Promise<Object>} 统计信息
   */
  async getStats() {
    try {
      logDao('getStats', {});
      
      const totalResult = await this.db.execute('SELECT COUNT(*) as total FROM products');
      const activeResult = await this.db.execute('SELECT COUNT(*) as active FROM products WHERE status = "active"');
      const lowStockResult = await this.db.execute('SELECT COUNT(*) as lowStock FROM products WHERE stock < 10');
      const categoriesResult = await this.db.execute('SELECT category, COUNT(*) as count FROM products GROUP BY category');
      
      const total = (Array.isArray(totalResult) ? totalResult[0] : totalResult.rows)[0].total;
      const active = (Array.isArray(activeResult) ? activeResult[0] : activeResult.rows)[0].active;
      const lowStock = (Array.isArray(lowStockResult) ? lowStockResult[0] : lowStockResult.rows)[0].lowStock;
      const categories = Array.isArray(categoriesResult) ? categoriesResult[0] : categoriesResult.rows;
      
      const stats = {
        total,
        active,
        inactive: total - active,
        lowStock,
        categories
      };
      
      logDao('getStats', {}, stats);
      return stats;
    } catch (error) {
      logDao('getStats', {}, null, error);
      console.error('获取商品统计信息失败:', error);
      throw new Error('获取统计信息失败');
    }
  }

  /**
   * 批量更新商品状态
   * @param {Array} ids 商品ID数组
   * @param {string} status 新状态
   * @returns {Promise<number>} 更新的商品数量
   */
  async batchUpdateStatus(ids, status) {
    try {
      logDao('batchUpdateStatus', { ids, status });
      
      if (!ids || ids.length === 0) {
        return 0;
      }
      
      const placeholders = ids.map(() => '?').join(',');
      const sql = `UPDATE products SET status = ?, updated_at = ? WHERE id IN (${placeholders})`;
      const params = [status, new Date(), ...ids];
      
      const result = await this.db.execute(sql, params);
      const affectedRows = Array.isArray(result) ? result[0].affectedRows : result.affectedRows;
      
      logDao('batchUpdateStatus', { ids, status }, { affectedRows });
      return affectedRows;
    } catch (error) {
      logDao('batchUpdateStatus', { ids, status }, null, error);
      console.error('批量更新商品状态失败:', error);
      throw new Error('批量更新失败');
    }
  }
}

module.exports = ProductDao;