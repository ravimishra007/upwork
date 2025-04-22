import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// List of vendor packages to split into chunks
const vendorPackages = [
  'react', 
  'react-dom', 
  'wouter', 
  '@tanstack/react-query'
];

// UI library packages
const uiPackages = [
  'lucide-react', 
  'class-variance-authority', 
  'clsx'
];

// Radix UI packages (these are individual packages)
const radixPackages = [
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-avatar',
  '@radix-ui/react-dialog'
  // Add others as needed
];

export default defineConfig({
  root: 'client',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'client/index.html')
      },
      output: {
        manualChunks: (id) => {
          // Put react and related packages in a vendor chunk
          if (vendorPackages.some(pkg => id.includes(`/node_modules/${pkg}/`))) {
            return 'vendor';
          }
          
          // Put UI libraries in a ui chunk
          if (uiPackages.some(pkg => id.includes(`/node_modules/${pkg}/`))) {
            return 'ui';
          }
          
          // Put Radix UI components in a radix chunk
          if (radixPackages.some(pkg => id.includes(`/node_modules/${pkg}/`))) {
            return 'radix-ui';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src')
    }
  }
}); 