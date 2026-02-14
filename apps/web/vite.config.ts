import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Web app (primary). Mobile demo: run with --host and open on device, or add vite-plugin-multi-device (Vite 2.x).
 */
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
});
