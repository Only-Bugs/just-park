import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  alias: {
    "@": path.resolve(new URL(".", import.meta.url).pathname, "src"),
  },
});
