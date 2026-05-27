import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: ["scripts/__tests__/**/*.test.ts"],
      name: "scripts"
    }
  },
  "packages/*",
  "apps/*"
]);
