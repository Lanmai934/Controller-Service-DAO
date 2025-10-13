const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Mock服务器启动脚本
 * 基于openapi.json自动生成Mock数据
 */

const PROJECT_ROOT = path.join(__dirname, '..');
const OPENAPI_FILE = path.join(PROJECT_ROOT, 'openapi.json');

console.log('🎭 启动Mock服务器...');

// 检查openapi.json是否存在
if (!fs.existsSync(OPENAPI_FILE)) {
    console.error('❌ openapi.json文件不存在，请先启动后端服务生成API规范');
    process.exit(1);
}

try {
    // 使用prism启动mock服务器
    console.log('🚀 基于OpenAPI规范启动Mock服务器...');
    console.log(`📄 使用规范文件: ${OPENAPI_FILE}`);
    
    const mockServer = spawn('npx', [
        '@stoplight/prism-cli',
        'mock',
        OPENAPI_FILE,
        '--host',
        '0.0.0.0',
        '--port',
        '4010',
        '--dynamic'
    ], {
        stdio: 'inherit',
        cwd: PROJECT_ROOT
    });
    
    console.log('✅ Mock服务器启动成功！');
    console.log('🌐 Mock API地址: http://localhost:4010');
    console.log('📚 API文档: http://localhost:4010/__admin/docs');
    console.log('💡 提示: 前端可以通过设置环境变量切换到Mock模式');
    console.log('🛑 按 Ctrl+C 停止Mock服务器\n');
    
    // 处理进程退出
    mockServer.on('close', (code) => {
        console.log(`\n👋 Mock服务器已停止 (退出代码: ${code})`);
    });
    
    // 优雅退出
    process.on('SIGINT', () => {
        console.log('\n🛑 正在停止Mock服务器...');
        mockServer.kill('SIGINT');
    });
    
} catch (error) {
    console.error('❌ Mock服务器启动失败:', error.message);
    console.log('\n💡 请确保已安装@stoplight/prism-cli:');
    console.log('npm install -g @stoplight/prism-cli');
    process.exit(1);
}