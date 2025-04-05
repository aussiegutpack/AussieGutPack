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
    : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log("VITE_BASE_PATH:", process.env.VITE_BASE_PATH);
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
});
