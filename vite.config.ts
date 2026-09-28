import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    host: "127.0.0.1",
    hmr: {
      host: "127.0.0.1",
      protocol: "ws",
      clientPort: process.env.PORT ? Number(process.env.PORT) : 5173,
    },
    open: !process.env.PORT,
  },
});
