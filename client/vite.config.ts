import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr({
            include: '**/*.svg',
        }),
        react(),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            '*': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        exclude: ['js-big-decimal'],
    },
    server: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
                ws: true
            },
            '^/signalrtc': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                ws: true
            }
        }
    },
    define: {
        'process.env.API_BASE_URL': JSON.stringify('/api')
    }
});