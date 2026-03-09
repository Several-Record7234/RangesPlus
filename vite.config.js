import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import react from "@vitejs/plugin-react";

/** Stamp package.json version into the built manifest.json */
function manifestVersion() {
  return {
    name: "manifest-version",
    closeBundle() {
      const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
      const manifestPath = resolve(__dirname, "dist/manifest.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
      manifest.version = pkg.version;
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    },
  };
}

export default defineConfig({
  plugins: [glsl(), react(), manifestVersion()],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "background.html"),
        theme: resolve(__dirname, "theme.html"),
        settings: resolve(__dirname, "settings.html"),
      },
    },
  },
  server: {
    cors: {
      origin: "https://www.owlbear.rodeo",
    },
  },
});
