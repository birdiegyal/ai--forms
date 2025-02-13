import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ">": path.resolve(__dirname, "/assets"),
    },
  },
  server: {
    proxy: {
      "/proxy": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ""),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const targetUrl = req.url?.split("?url=")[1]
            if (targetUrl) {
              proxyReq.setHeader("target", targetUrl)
            }
          })
        },
      },
    },
  },
})
