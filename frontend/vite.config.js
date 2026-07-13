import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {

    // Load .env from the project root (one level above frontend)
    const env = loadEnv(mode, path.resolve(__dirname, ".."), "");

    return {
        plugins: [react()],
        define: {
            "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL)
        }
    };

});