import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

// Load the appropriate .env file based on the mode
const mode = process.env.NODE_ENV || 'development';  // Default to development
const envFile = '.env.local';  // Use .env.local for development
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log("VITE_BASE_PATH:", process.env.VITE_BASE_PATH);

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/AussieGutPack' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: '',  // Ensure assets are in the root of dist to avoid subfolder issues
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
