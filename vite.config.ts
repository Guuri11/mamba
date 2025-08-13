import tailwindcss from "@tailwindcss/vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
            routesDirectory: "./src/presentation/routes",
            generatedRouteTree: "./src/presentation/routeTree.gen.ts",
            routeFileIgnorePrefix: "-",
            quoteStyle: "single",
        }),
        react(),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./src/presentation"),
            "@domain": path.resolve(__dirname, "./src/domain"),
            "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
            "@application": path.resolve(__dirname, "./src/application"),
        },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                  protocol: "ws",
                  host,
                  port: 1421,
              }
            : undefined,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
}));
