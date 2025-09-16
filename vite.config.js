import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      // 配置路劲在你的src里的svg存放文件
      iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
      symbolId: 'local-icon-[dir]-[name]'
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/adminapi': {
        target: 'http://192.168.1.102/adminapi',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // 获取客户端真实 IP，可通过 req.socket.remoteAddress 获取
            const clientIP = req.socket.remoteAddress;
            // 添加 X-Forwarded-For 头部，通常包含客户端及代理链的IP列表
            proxyReq.setHeader('X-Forwarded-For', clientIP);
            // 添加 X-Real-IP 头部，直接传递客户端真实IP
            proxyReq.setHeader('X-Real-IP', clientIP);
            // 你也可以设置其他需要的头部，例如原始协议
            // proxyReq.setHeader('X-Forwarded-Proto', req.socket.encrypted ? 'https' : 'http');
          });
        },
        rewrite: (path) => path.replace(/^\/adminapi/, '')
      },
      '/api': {
        target: 'http://192.168.1.102/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        target: 'http://192.168.1.102/uploads',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, '')
      },
      '/erp-oss': {
        target: 'http://192.168.1.102/erp-oss',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/erp-oss/, '')
      },
      '/build': {
        target: 'http://192.168.1.114:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/build/, '')
      },
      '/wsAgent': {
        target: 'ws://192.168.1.102:2345',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/~\/wsAgent/, '')
      },
      '/ISAPI': {
        target: 'http://192.168.1.114:8090/ISAPI',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ISAPI/, '')
      },
      '/SDK': {
        target: 'http://192.168.1.114:8090/SDK',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/SDK/, '')
      },
      '/webSocketVideoCtrlProxy': {
        target: 'http://192.168.1.114:8090/webSocketVideoCtrlProxy',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/webSocketVideoCtrlProxy/, '')
      }
    }
  }
});
