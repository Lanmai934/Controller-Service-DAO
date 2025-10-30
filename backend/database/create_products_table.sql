-- 创建商品表
-- 请在MySQL中执行此SQL文件来创建商品表结构

USE lanmaisql;

-- 创建商品表
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY COMMENT '商品ID',
  name VARCHAR(200) NOT NULL COMMENT '商品名称',
  description TEXT COMMENT '商品描述',
  price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
  category VARCHAR(100) NOT NULL COMMENT '商品分类',
  brand VARCHAR(100) COMMENT '商品品牌',
  sku VARCHAR(100) NOT NULL UNIQUE COMMENT '商品SKU',
  stock INT DEFAULT 0 COMMENT '库存数量',
  images JSON COMMENT '商品图片URL列表',
  status ENUM('active', 'inactive', 'draft') DEFAULT 'active' COMMENT '商品状态',
  weight DECIMAL(8,3) COMMENT '商品重量(kg)',
  dimensions JSON COMMENT '商品尺寸(长宽高)',
  tags JSON COMMENT '商品标签',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  INDEX idx_category (category),
  INDEX idx_brand (brand),
  INDEX idx_sku (sku),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_stock (stock),
  INDEX idx_created_at (created_at),
  
  -- 全文索引用于搜索
  FULLTEXT INDEX idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 插入示例商品数据
INSERT INTO products (id, name, description, price, category, brand, sku, stock, images, status, weight, dimensions, tags) VALUES 
('prod_001', 'iPhone 15 Pro', '最新款iPhone，配备A17 Pro芯片，支持5G网络', 7999.00, '电子产品', 'Apple', 'IPH15P-128GB-BLK', 100, 
 JSON_ARRAY('https://example.com/iphone15pro1.jpg', 'https://example.com/iphone15pro2.jpg'), 
 'active', 0.187, 
 JSON_OBJECT('length', 14.67, 'width', 7.09, 'height', 0.83), 
 JSON_ARRAY('热销', '新品', '推荐')),

('prod_002', 'MacBook Pro 14英寸', '搭载M3芯片的专业级笔记本电脑', 14999.00, '电子产品', 'Apple', 'MBP14-M3-512GB', 50, 
 JSON_ARRAY('https://example.com/macbookpro1.jpg', 'https://example.com/macbookpro2.jpg'), 
 'active', 1.55, 
 JSON_OBJECT('length', 31.26, 'width', 22.12, 'height', 1.55), 
 JSON_ARRAY('专业', '高性能', '推荐')),

('prod_003', 'Nike Air Max 270', '舒适透气的运动鞋，适合日常穿着', 899.00, '服装鞋帽', 'Nike', 'NAM270-BLK-42', 200, 
 JSON_ARRAY('https://example.com/nike270_1.jpg', 'https://example.com/nike270_2.jpg'), 
 'active', 0.8, 
 JSON_OBJECT('length', 30, 'width', 11, 'height', 10), 
 JSON_ARRAY('运动', '舒适', '透气')),

('prod_004', '小米13 Ultra', '徕卡影像旗舰手机，专业摄影体验', 5999.00, '电子产品', '小米', 'MI13U-256GB-WHT', 80, 
 JSON_ARRAY('https://example.com/mi13ultra1.jpg', 'https://example.com/mi13ultra2.jpg'), 
 'active', 0.227, 
 JSON_OBJECT('length', 16.38, 'width', 7.44, 'height', 0.91), 
 JSON_ARRAY('摄影', '旗舰', '徕卡')),

('prod_005', '戴森V15吸尘器', '强劲吸力无线吸尘器，智能检测灰尘', 3990.00, '家用电器', 'Dyson', 'DYS-V15-DETECT', 30, 
 JSON_ARRAY('https://example.com/dysonv15_1.jpg', 'https://example.com/dysonv15_2.jpg'), 
 'active', 3.1, 
 JSON_OBJECT('length', 125, 'width', 25, 'height', 25), 
 JSON_ARRAY('无线', '强劲', '智能'));

-- 查看创建的表结构
DESCRIBE products;

-- 查看插入的商品数据
SELECT id, name, price, category, brand, sku, stock, status, created_at FROM products;

-- 显示成功消息
SELECT '商品表创建成功！已插入5条示例数据。' AS message;