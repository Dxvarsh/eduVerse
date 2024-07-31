import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        addDoc: resolve(__dirname, 'src/addDoc.html'),
        bookmark: resolve(__dirname, 'src/bookmark.html'),
        home: resolve(__dirname, 'src/home.html'),
        login: resolve(__dirname, 'src/login.html'),
        signup: resolve(__dirname, 'src/signup.html')
      },
      output: {
        addDoc: 'assets/addDoc.[hash].js',
        bookmark: 'assets/bookmark.[hash].js',
        script: 'assets/script.[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    outDir: 'dist',
    assetsDir: 'assets'
  }
});