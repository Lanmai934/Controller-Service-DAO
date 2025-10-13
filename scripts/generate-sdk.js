const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 自动生成前端SDK脚本
 * 基于OpenAPI规范生成TypeScript SDK
 */

const OPENAPI_FILE = path.join(__dirname, '..', 'openapi.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'frontend', 'src', 'api');

console.log('🚀 开始生成前端SDK...');

// 检查OpenAPI文件是否存在
if (!fs.existsSync(OPENAPI_FILE)) {
  console.error('❌ OpenAPI规范文件不存在:', OPENAPI_FILE);
  console.log('💡 请先启动后端服务以生成OpenAPI规范');
  process.exit(1);
}

try {
  // 清理输出目录
  if (fs.existsSync(OUTPUT_DIR)) {
    console.log('🧹 清理旧的SDK文件...');
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }

  // 创建输出目录
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 使用swagger-typescript-api生成TypeScript SDK（不需要Java）
  console.log('📦 生成TypeScript SDK...');
  const generateCommand = `npx swagger-typescript-api -p "${OPENAPI_FILE}" -o "${OUTPUT_DIR}" -n api.ts --modular --axios`;

  execSync(generateCommand, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'frontend')
  });

  console.log('✅ SDK生成完成!');
  console.log('📁 输出目录:', OUTPUT_DIR);

  console.log('🎉 前端SDK生成完成!');
  console.log('💡 现在可以在前端项目中导入和使用API客户端');

} catch (error) {
  console.error('❌ SDK生成失败:', error.message);
  process.exit(1);
}