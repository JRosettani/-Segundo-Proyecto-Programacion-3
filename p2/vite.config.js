import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        favorites: resolve(__dirname, "src/pages/favorites/index.html"),
        info: resolve(__dirname, "src/pages/info/index.html"),
      },
    },
  },
});
