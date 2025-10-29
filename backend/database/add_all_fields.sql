-- 为users表添加所有必要字段：password、username、role
-- 执行时间: 2025-01-18

USE controller_service_dao;

-- 1. 首先添加password字段
ALTER TABLE users 
ADD COLUMN password VARCHAR(255) COMMENT '用户密码(加密后)' AFTER email;

-- 2. 添加username字段
ALTER TABLE users 
ADD COLUMN username VARCHAR(50) COMMENT '用户名，唯一标识' AFTER password;

-- 3. 添加role字段
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin', 'super_admin') DEFAULT 'user' COMMENT '用户角色：user-普通用户，admin-管理员，super_admin-超级管理员' AFTER username;

-- 4. 为现有用户设置默认密码（bcrypt加密的'123456'）
UPDATE users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE password IS NULL OR password = '';

-- 5. 为现有用户设置默认用户名（基于邮箱前缀）
UPDATE users 
SET username = CONCAT(SUBSTRING_INDEX(email, '@', 1), '_', id)
WHERE username IS NULL OR username = '';

-- 6. 添加唯一索引到username字段
ALTER TABLE users 
ADD UNIQUE INDEX idx_username (username);

-- 7. 查看更新后的表结构
DESCRIBE users;

-- 8. 显示所有用户数据
SELECT id, name, email, username, role, age, status, created_at FROM users;

SELECT 'All fields (password, username, role) added successfully!' as message;