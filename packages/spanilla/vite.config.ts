import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    conditions: ["@dierkens.dev/source"],
  },
  build: {
    minify: true,
    sourcemap: false,
    lib: {
      entry: [
        resolve(__dirname, "src/spanilla.ts"),
        resolve(__dirname, "src/web.ts"),
        resolve(__dirname, "src/server.ts"),
      ],
    },
    rollupOptions: {
      external: ["jsdom"],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
