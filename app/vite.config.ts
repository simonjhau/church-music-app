import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:9000",
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    define: {
      VITE_AUTH0_DOMAIN: env.VITE_AUTH0_DOMAIN,
      VITE_AUTH0_CLIENT_ID: env.VITE_AUTH0_CLIENT_ID,
      VITE_AUTH0_REDIRECT_URI: env.VITE_AUTH0_REDIRECT_URI,
      VITE_AUTH0_AUDIENCE: env.VITE_AUTH0_AUDIENCE,
    },
  };
});
