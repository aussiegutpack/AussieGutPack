import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import path from "path";

// Load the appropriate .env file based on the mode
const mode = process.argv.includes("--mode")
  ? process.argv[process.argv.indexOf("--mode") + 1]
  : "development";
const envFile =
  mode === "github"
    ? ".env.github"
    : mode === "vercel"
    ? ".env.vercel"
    : ".env.local";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log("VITE_BASE_PATH:", process.env.VITE_BASE_PATH);

const base =
  mode === "github" || process.env.NODE_ENV === "production"
    ? "/AussieGutPack/"
    : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
