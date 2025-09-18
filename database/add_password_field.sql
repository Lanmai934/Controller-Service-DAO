-- 为用户表添加密码字段
-- 请在MySQL中执行此SQL文件来添加密码字段

USE lanmaisql;

-- 添加密码字段
ALTER TABLE users 
ADD COLUMN password VARCHAR(255) NOT NULL COMMENT '用户密码(加密后)' AFTER email;

-- 查看更新后的表结构
DESCRIBE users;

-- 为现有用户添加默认密码（实际使用中应该要求用户重新设置密码）
-- 这里使用bcrypt加密的'123456'作为默认密码
UPDATE users SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE password = '';

SELECT id, name, email, password, age, created_at FROM users;