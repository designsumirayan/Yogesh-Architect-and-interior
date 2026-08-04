import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  // Force Cloudflare/Nitro support
  nitro: {
    preset: "cloudflare_module",
  },
});
