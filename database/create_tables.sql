-- 创建lanmaisql数据库的用户表
-- 请在MySQL中执行此SQL文件来创建必要的表结构

USE lanmaisql;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  name VARCHAR(100) NOT NULL COMMENT '用户姓名',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱地址',
  age INT DEFAULT NULL COMMENT '年龄',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入示例数据
INSERT INTO users (name, email, age) VALUES 
('张三', 'zhangsan@example.com', 25),
('李四', 'lisi@example.com', 30),
('王五', 'wangwu@example.com', 28),
('赵六', 'zhaoliu@example.com', 35);

-- 查看创建的表结构
DESCRIBE users;

-- 查看插入的数据
SELECT * FROM users;