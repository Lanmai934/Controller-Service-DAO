import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * API同步脚本 - Frontend-App版本
 * 监听后端API变更，自动重新生成前端SDK
 */

const PROJECT_ROOT = path.join(__dirname, '../..');
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend');
const BACKEND_ROUTES = path.join(BACKEND_DIR, 'src/routes');
const BACKEND_CONTROLLERS = path.join(BACKEND_DIR, 'src/controllers');
const OPENAPI_FILE = path.join(BACKEND_DIR, 'openapi.json');
const FRONTEND_APP_DIR = path.join(PROJECT_ROOT, 'frontend-app');

let isGenerating = false;
let regenerateTimer = null;

console.log('👀 开始监听API变更...');
console.log(`📂 监听目录: ${BACKEND_ROUTES}`);
console.log(`📂 监听目录: ${BACKEND_CONTROLLERS}`);

/**
 * 重新生成SDK
 */
async function regenerateSDK() {
    if (isGenerating) {
        console.log('⏳ SDK正在生成中，跳过此次更新...');
        return;
    }
    
    isGenerating = true;
    
    try {
        console.log('\n🔄 检测到API变更，开始重新生成SDK...');
        
        // 等待文件写入完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 重新生成openapi.json
        console.log('📝 重新生成API规范...');
        const backendProcess = spawn('node', ['-e', `
            const { generateOpenApiFile } = require('../../backend/src/config/swagger');
            generateOpenApiFile();
            console.log('API规范已更新');
        `], { 
            cwd: BACKEND_DIR,
            stdio: 'inherit'
        });
        
        await new Promise((resolve, reject) => {
            backendProcess.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`后端进程退出，代码: ${code}`));
            });
        });
        
        // 检查openapi.json是否存在
        if (!fs.existsSync(OPENAPI_FILE)) {
            console.log('⚠️  openapi.json未生成，可能需要启动后端服务');
            return;
        }
        
        // 重新生成前端SDK
        if (fs.existsSync(FRONTEND_APP_DIR)) {
            console.log('🔧 重新生成前端SDK...');
            execSync('npm run generate-api', { 
                cwd: FRONTEND_APP_DIR,
                stdio: 'inherit'
            });
            
            console.log('✅ SDK重新生成完成！');
            console.log('🎯 前端代码已自动更新，类型定义和API调用已同步');
        }
        
    } catch (error) {
        console.error('❌ SDK重新生成失败:', error.message);
    } finally {
        isGenerating = false;
    }
}

/**
 * 防抖处理，避免频繁重新生成
 */
function scheduleRegenerate() {
    if (regenerateTimer) {
        clearTimeout(regenerateTimer);
    }
    
    regenerateTimer = setTimeout(() => {
        regenerateSDK();
    }, 2000); // 2秒防抖
}

// 检查目录是否存在
if (!fs.existsSync(BACKEND_ROUTES)) {
    console.error(`❌ 后端路由目录不存在: ${BACKEND_ROUTES}`);
    process.exit(1);
}

if (!fs.existsSync(BACKEND_CONTROLLERS)) {
    console.error(`❌ 后端控制器目录不存在: ${BACKEND_CONTROLLERS}`);
    process.exit(1);
}

// 监听路由文件变更
const routesWatcher = chokidar.watch(BACKEND_ROUTES, {
    ignored: /node_modules/,
    persistent: true
});

// 监听控制器文件变更
const controllersWatcher = chokidar.watch(BACKEND_CONTROLLERS, {
    ignored: /node_modules/,
    persistent: true
});

// 设置事件监听
[routesWatcher, controllersWatcher].forEach(watcher => {
    watcher
        .on('change', (filePath) => {
            console.log(`📝 文件变更: ${path.relative(PROJECT_ROOT, filePath)}`);
            scheduleRegenerate();
        })
        .on('add', (filePath) => {
            console.log(`➕ 新增文件: ${path.relative(PROJECT_ROOT, filePath)}`);
            scheduleRegenerate();
        })
        .on('unlink', (filePath) => {
            console.log(`🗑️  删除文件: ${path.relative(PROJECT_ROOT, filePath)}`);
            scheduleRegenerate();
        });
});

console.log('✅ API同步监听已启动');
console.log('💡 提示: 修改路由或控制器文件时，SDK将自动重新生成');
console.log('🛑 按 Ctrl+C 停止监听\n');

// 优雅退出
process.on('SIGINT', () => {
    console.log('\n👋 停止API同步监听...');
    routesWatcher.close();
    controllersWatcher.close();
    process.exit(0);
});