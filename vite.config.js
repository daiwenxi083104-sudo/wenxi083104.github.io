import { defineConfig } from 'vite';

export default defineConfig({
  // 项目根目录
  root: '.',
  
  // 构建输出目录
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    
    // 代码压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console.log（调试用）
        drop_debugger: true,
        pure_funcs: ['console.debug']
      },
      format: {
        comments: false // 移除注释
      }
    },
    
    // CSS 压缩
    cssMinify: true,
    
    // 文件命名
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // 目标浏览器兼容性
    target: 'es2015',
    
    // 启用 source map（生产环境可关闭）
    sourcemap: false
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // 预览服务器配置
  preview: {
    port: 4173
  },
  
  // CSS 配置
  css: {
    devSourcemap: true
  }
});