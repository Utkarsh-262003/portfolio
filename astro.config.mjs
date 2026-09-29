// Static build only: `npm run build` writes plain files to dist/ for Azure Static Web Apps.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://utkarshtyagi.in",
  output: "static",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
