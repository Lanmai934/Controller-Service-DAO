const bcrypt = require('bcrypt');

/**
 * 用户数据模型
 * 定义用户实体的结构和验证规则
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || ''; // 密码字段
    this.age = data.age || null;
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.status = data.status || 'active'; // active, inactive, deleted
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * 验证用户数据
   */
  validate() {
    const errors = [];

    // 验证姓名
    if (!this.name || this.name.trim() === '') {
      errors.push('姓名不能为空');
    } else if (this.name.length < 2 || this.name.length > 50) {
      errors.push('姓名长度必须在2-50个字符之间');
    }

    // 验证邮箱
    if (!this.email || this.email.trim() === '') {
      errors.push('邮箱不能为空');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('邮箱格式不正确');
    }

    // 验证密码（仅在创建新用户时验证原始密码）
    if (this.password && !this.isPasswordHashed(this.password)) {
      if (this.password.length < 6) {
        errors.push('密码长度不能少于6位');
      }
      if (this.password.length > 50) {
        errors.push('密码长度不能超过50位');
      }
    }

    // 验证年龄
    if (this.age !== null && this.age !== undefined) {
      if (!Number.isInteger(this.age) || this.age < 0 || this.age > 150) {
        errors.push('年龄必须是0-150之间的整数');
      }
    }

    // 验证手机号
    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('手机号格式不正确');
    }

    // 验证状态
    const validStatuses = ['active', 'inactive', 'deleted'];
    if (!validStatuses.includes(this.status)) {
      errors.push('用户状态无效');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * 验证邮箱格式
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证手机号格式
   */
  isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 检查密码是否已经被哈希加密
   */
  isPasswordHashed(password) {
    // bcrypt哈希值通常以$2b$开头，长度为60字符
    return password && password.startsWith('$2b$') && password.length === 60;
  }

  /**
   * 加密密码
   */
  async hashPassword() {
    if (this.password && !this.isPasswordHashed(this.password)) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  /**
   * 验证密码
   */
  async validatePassword(plainPassword) {
    if (!this.password || !plainPassword) {
      return false;
    }
    return await bcrypt.compare(plainPassword, this.password);
  }

  /**
   * 转换为JSON对象（用于API响应）
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      phone: this.phone,
      address: this.address,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 转换为数据库存储格式
   */
  toDatabase() {
    return {
      name: this.name,
      email: this.email,
      age: this.age,
      phone: this.phone,
      address: this.address,
      status: this.status,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  /**
   * 从数据库数据创建用户实例
   */
  static fromDatabase(dbData) {
    return new User({
      id: dbData.id,
      name: dbData.name,
      email: dbData.email,
      age: dbData.age,
      phone: dbData.phone,
      address: dbData.address,
      status: dbData.status,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at
    });
  }

  /**
   * 更新用户信息
   */
  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.age !== undefined) this.age = data.age;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    if (data.status !== undefined) this.status = data.status;
    
    this.updatedAt = new Date();
    return this;
  }

  /**
   * 获取用户显示名称
   */
  getDisplayName() {
    return this.name || this.email.split('@')[0];
  }

  /**
   * 检查用户是否激活
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * 激活用户
   */
  activate() {
    this.status = 'active';
    this.updatedAt = new Date();
    return this;
  }

  /**
   * 停用用户
   */
  deactivate() {
    this.status = 'inactive';
    this.updatedAt = new Date();
    return this;
  }

  /**
   * 软删除用户
   */
  softDelete() {
    this.status = 'deleted';
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = User;