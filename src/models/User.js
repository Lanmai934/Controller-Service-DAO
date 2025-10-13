/**
 * 用户数据模型（演示版本）
 * 定义用户实体的结构和验证规则
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.username = data.username || '';
    this.password = data.password || '';
    this.role = data.role || 'user';
    this.age = data.age || null;
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * 验证用户数据
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('姓名不能为空');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('邮箱格式不正确');
    }

    if (!this.username || this.username.trim().length < 3) {
      errors.push('用户名至少需要3个字符');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('密码至少需要6个字符');
    }

    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('手机号格式不正确');
    }

    return {
      isValid: errors.length === 0,
      errors
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
   * 验证用户名格式
   */
  isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * 密码哈希（演示版本）
   */
  async hashPassword() {
    // 演示版本：简单的密码处理
    this.password = `hashed_${this.password}`;
  }

  /**
   * 验证密码（演示版本）
   */
  async validatePassword(plainPassword) {
    // 演示版本：简单的密码验证
    return this.password === `hashed_${plainPassword}`;
  }

  /**
   * 转换为JSON格式（隐藏敏感信息）
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      role: this.role,
      age: this.age,
      phone: this.phone,
      address: this.address,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 转换为数据库格式
   */
  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
      role: this.role,
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
      username: dbData.username,
      password: dbData.password,
      role: dbData.role,
      age: dbData.age,
      phone: dbData.phone,
      address: dbData.address,
      status: dbData.status,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at
    });
  }

  /**
   * 更新用户数据
   */
  update(data) {
    Object.keys(data).forEach(key => {
      if (this.hasOwnProperty(key) && key !== 'id' && key !== 'createdAt') {
        this[key] = data[key];
      }
    });
    this.updatedAt = new Date();
  }

  /**
   * 获取显示名称
   */
  getDisplayName() {
    return this.name || this.username || this.email;
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
  }

  /**
   * 停用用户
   */
  deactivate() {
    this.status = 'inactive';
    this.updatedAt = new Date();
  }

  /**
   * 软删除用户
   */
  softDelete() {
    this.status = 'deleted';
    this.updatedAt = new Date();
  }

  /**
   * 检查是否为超级管理员
   */
  isSuperAdmin() {
    return this.role === 'super_admin';
  }

  /**
   * 检查是否为管理员
   */
  isAdmin() {
    return this.role === 'admin' || this.role === 'super_admin';
  }

  /**
   * 检查是否为普通用户
   */
  isUser() {
    return this.role === 'user';
  }
}

module.exports = User;