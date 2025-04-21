import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis", // 👈 Fixes the 'global is not defined' error
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8001", // your Express server
        changeOrigin: true,
      },
    },
  },
});
