import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - Phase 3 Performance Optimization
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  base: '/tempo/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Phase 3: Performance optimizations
    target: 'es2015', // Smaller bundle for modern browsers
    minify: 'terser', // Better compression than esbuild
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        },
        // Optimize chunk file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      },
    },
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
