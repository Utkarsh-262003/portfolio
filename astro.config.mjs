// Static build only: `npm run build` writes plain files to dist/ for Azure Static Web Apps.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://utkarshtyagi.in",
  output: "static",
  build: { format: "directory" },
  // Astro's HTML compression drops the space between a line-ending word and an inline tag
  // ("and<code>"). Off: gzip on the host makes the size difference negligible.
  compressHTML: false,
  devToolbar: { enabled: false },
});
