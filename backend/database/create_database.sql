-- 创建lanmaisql数据库
-- 请先在MySQL中执行此SQL文件来创建数据库

-- 创建数据库
CREATE DATABASE IF NOT EXISTS lanmaisql 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

-- 显示创建的数据库
SHOW DATABASES LIKE 'lanmaisql';

-- 使用数据库
USE lanmaisql;

SELECT 'lanmaisql数据库创建成功！' AS message;