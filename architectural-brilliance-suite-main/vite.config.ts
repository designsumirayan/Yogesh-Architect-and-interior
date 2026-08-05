import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  // Generate Vercel Build Output API files for this SSR application.
  nitro: {
    preset: "vercel",
  },
});
