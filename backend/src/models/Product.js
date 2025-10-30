/**
 * 商品数据模型
 * 定义商品实体的结构和验证规则
 */
class Product {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category = data.category || '';
    this.brand = data.brand || '';
    this.sku = data.sku || '';
    this.stock = data.stock || 0;
    this.images = data.images || [];
    this.status = data.status || 'active'; // active, inactive, discontinued
    this.weight = data.weight || null;
    this.dimensions = data.dimensions || null; // {length, width, height}
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * 验证商品数据
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('商品名称不能为空');
    }

    if (this.name && this.name.length > 200) {
      errors.push('商品名称不能超过200个字符');
    }

    if (!this.price || this.price < 0) {
      errors.push('商品价格必须大于等于0');
    }

    if (this.price && this.price > 999999.99) {
      errors.push('商品价格不能超过999999.99');
    }

    if (!this.category || this.category.trim().length === 0) {
      errors.push('商品分类不能为空');
    }

    if (this.sku && this.sku.length > 50) {
      errors.push('SKU不能超过50个字符');
    }

    if (this.stock < 0) {
      errors.push('库存数量不能为负数');
    }

    if (this.weight && this.weight < 0) {
      errors.push('商品重量不能为负数');
    }

    if (!['active', 'inactive', 'discontinued'].includes(this.status)) {
      errors.push('商品状态必须是 active、inactive 或 discontinued');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证SKU格式
   */
  isValidSKU(sku) {
    const skuRegex = /^[A-Z0-9-_]{3,50}$/;
    return skuRegex.test(sku);
  }

  /**
   * 格式化价格
   */
  formatPrice() {
    return parseFloat(this.price).toFixed(2);
  }

  /**
   * 检查是否有库存
   */
  isInStock() {
    return this.stock > 0;
  }

  /**
   * 检查是否为活跃商品
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * 获取商品的完整信息（用于API响应）
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: parseFloat(this.price),
      category: this.category,
      brand: this.brand,
      sku: this.sku,
      stock: this.stock,
      images: this.images,
      status: this.status,
      weight: this.weight,
      dimensions: this.dimensions,
      tags: this.tags,
      isInStock: this.isInStock(),
      isActive: this.isActive(),
      formattedPrice: this.formatPrice(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 获取商品的简要信息（用于列表显示）
   */
  toSummary() {
    return {
      id: this.id,
      name: this.name,
      price: parseFloat(this.price),
      category: this.category,
      brand: this.brand,
      sku: this.sku,
      stock: this.stock,
      status: this.status,
      isInStock: this.isInStock(),
      formattedPrice: this.formatPrice(),
      createdAt: this.createdAt
    };
  }

  /**
   * 更新库存
   */
  updateStock(quantity) {
    if (typeof quantity !== 'number') {
      throw new Error('库存数量必须是数字');
    }
    
    const newStock = this.stock + quantity;
    if (newStock < 0) {
      throw new Error('库存不足');
    }
    
    this.stock = newStock;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * 设置商品状态
   */
  setStatus(status) {
    if (!['active', 'inactive', 'discontinued'].includes(status)) {
      throw new Error('无效的商品状态');
    }
    
    this.status = status;
    this.updatedAt = new Date();
    return this;
  }

  /**
   * 添加标签
   */
  addTag(tag) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * 移除标签
   */
  removeTag(tag) {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * 添加图片
   */
  addImage(imageUrl) {
    if (imageUrl && !this.images.includes(imageUrl)) {
      this.images.push(imageUrl);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * 移除图片
   */
  removeImage(imageUrl) {
    const index = this.images.indexOf(imageUrl);
    if (index > -1) {
      this.images.splice(index, 1);
      this.updatedAt = new Date();
    }
    return this;
  }

  /**
   * 创建商品实例的静态方法
   */
  static create(data) {
    const product = new Product(data);
    const validation = product.validate();
    
    if (!validation.isValid) {
      throw new Error(`商品数据验证失败: ${validation.errors.join(', ')}`);
    }
    
    return product;
  }

  /**
   * 从数据库行数据创建商品实例
   */
  static fromRow(row) {
    try {
      // 安全解析JSON字段
      const parseJsonField = (field, fieldName, defaultValue = null) => {
        if (!field) return defaultValue;
        
        // 如果已经是对象，直接返回
        if (typeof field === 'object') return field;
        
        // 如果是字符串，尝试解析
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch (error) {
            console.error(`解析${fieldName}字段失败:`, field, error.message);
            return defaultValue;
          }
        }
        
        return defaultValue;
      };

      return new Product({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        category: row.category,
        brand: row.brand,
        sku: row.sku,
        stock: row.stock,
        images: parseJsonField(row.images, 'images', []),
        status: row.status,
        weight: row.weight,
        dimensions: parseJsonField(row.dimensions, 'dimensions', null),
        tags: parseJsonField(row.tags, 'tags', []),
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } catch (error) {
      console.error('Product.fromRow 转换失败:', error.message);
      console.error('原始数据:', row);
      throw error;
    }
  }
}

module.exports = Product;