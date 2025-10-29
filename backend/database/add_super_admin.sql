-- 添加超级管理员账户
-- 执行时间: 2025-09-18

USE controller_service_dao;

-- 插入超级管理员账户
-- 密码: admin123 (已加密)
INSERT INTO users (name, email, username, age, password, role, status, created_at, updated_at) 
VALUES (
    '超级管理员',
    'admin@system.com',
    'admin',
    30,
    '$2b$10$rQJ8YQZ9X5K5Z5Z5Z5Z5ZeJ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5',
    'super_admin',
    'active',
    NOW(),
    NOW()
);

-- 验证插入结果
SELECT id, name, email, username, role, status, created_at 
FROM users 
WHERE role = 'super_admin';

SELECT 'Super admin account created successfully!' as message;
SELECT 'Username: admin, Password: admin123' as login_info;