import { defineConfig } from "tsup"

export default defineConfig({
    format: "cjs",
    entry: ['./cli/index.ts'],
    outDir: "./bin",
    skipNodeModulesBundle: true,
    dts: false
})