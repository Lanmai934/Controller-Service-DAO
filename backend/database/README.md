# 数据库配置说明

## 快速开始

### 1. 创建数据库
请在MySQL中执行以下SQL文件来创建数据库：
```sql
-- 执行此文件创建数据库
source database/create_database.sql
```

或者直接在MySQL命令行中执行：
```sql
CREATE DATABASE IF NOT EXISTS lanmaisql 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;
```

### 2. 创建数据表
数据库创建完成后，执行以下SQL文件来创建用户表：
```sql
-- 执行此文件创建用户表结构和示例数据
source database/create_tables.sql
```

### 3. 创建商品表
执行以下SQL文件来创建商品表：
```sql
-- 执行此文件创建商品表结构和示例数据
source database/create_products_table.sql
```

### 4. 配置数据库连接
确保 `.env` 文件中的数据库配置正确：
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lanmaisql
DB_USER=root
DB_PASSWORD=666306
```

### 5. 测试数据库连接
运行测试脚本验证连接：
```bash
node test-db-connection.js
```

## 文件说明

- `create_database.sql` - 创建lanmaisql数据库
- `create_tables.sql` - 创建用户表和插入示例数据
- `create_products_table.sql` - 创建商品表和插入示例数据
- `../test-db-connection.js` - 数据库连接测试脚本

## 注意事项

1. 确保MySQL服务已启动
2. 确保数据库用户有足够的权限
3. 如果连接失败，请检查用户名和密码是否正确
4. 确保数据库名称为 `lanmaisql`

## 故障排除

### 常见错误

1. **Access denied for user 'root'@'localhost'**
   - 检查用户名和密码是否正确
   - 确保MySQL用户有访问权限

2. **Unknown database 'lanmaisql'**
   - 先执行 `create_database.sql` 创建数据库

3. **Table 'lanmaisql.users' doesn't exist**
   - 执行 `create_tables.sql` 创建用户表

### 手动创建步骤

如果自动脚本失败，可以手动在MySQL中执行：

```sql
-- 1. 创建数据库
CREATE DATABASE lanmaisql;

-- 2. 使用数据库
USE lanmaisql;

-- 3. 创建用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. 插入测试数据
INSERT INTO users (name, email, age) VALUES 
('张三', 'zhangsan@example.com', 25),
('李四', 'lisi@example.com', 30);
```