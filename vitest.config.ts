
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["tests/**/*.test.ts"],
    testTimeout: 15000,
    hookTimeout: 15000,

    // Run database integration tests sequentially.
    fileParallelism: false
  }
});
