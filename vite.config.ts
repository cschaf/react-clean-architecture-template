import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  base: "/react-clean-architecture-template/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/app": path.resolve(__dirname, "./src/app"),
      "@/domain": path.resolve(__dirname, "./src/domain"),
      "@/infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@/presentation": path.resolve(__dirname, "./src/presentation"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
    },
  },
})

