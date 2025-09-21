import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'),
                str: path.resolve(__dirname, 'src/index2.html'),
                str3: path.resolve(__dirname, 'src/index3.html')
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