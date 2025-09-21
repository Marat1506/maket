import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    root: path.resolve(__dirname, 'src'), // Корень - папка src
    build: {
        outDir: '../dist', // Выходная директория на уровень выше
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/index.html'), // Полный путь
                str3: path.resolve(__dirname, 'src/index3.html') // Полный путь
            },
            output: {
                manualChunks: undefined,
                // Опционально: переименовать выходные файлы
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'index3.html') {
                        return 'str3.html'; // Переименовываем index2.html в str3.html
                    }
                    return 'assets/[name]-[hash][extname]';
                }
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