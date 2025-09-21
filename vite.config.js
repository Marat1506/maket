import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './index.html',
                str3: './index3.html' // Указываем правильное имя файла
            },
            output: {
                manualChunks: undefined
            }
        },
        target: 'es2015'
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    server: {
        port: 8080,
        hot: true
    }
})