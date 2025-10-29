-- 为users表添加username和role字段
-- 执行时间: 2025-09-18

USE controller_service_dao;

-- 添加username字段（唯一索引）
ALTER TABLE users 
ADD COLUMN username VARCHAR(50) UNIQUE COMMENT '用户名，唯一标识';

-- 添加role字段（默认为普通用户）
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin', 'super_admin') DEFAULT 'user' COMMENT '用户角色：user-普通用户，admin-管理员，super_admin-超级管理员';

-- 为现有用户设置默认用户名（基于邮箱前缀）
UPDATE users 
SET username = SUBSTRING_INDEX(email, '@', 1) 
WHERE username IS NULL;

-- 确保username字段不为空
ALTER TABLE users 
MODIFY COLUMN username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名，唯一标识';

SELECT 'Username and role fields added successfully!' as message;