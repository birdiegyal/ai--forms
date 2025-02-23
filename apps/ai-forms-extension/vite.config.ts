import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  // @ts-ignore.
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        "content-script": path.resolve(__dirname, "src/content-script.ts")
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
})
