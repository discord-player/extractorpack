import path from "path"
export const CLASS_VAR = "EXTRACTOR_PACK_CLASS" as const
export const OPTIONS_VAR = 'EXTRACTOR_PACK_EXT_OPTIONS' as const
export const TYPES_VAR = "EXTRACTOR_PACK_TYPES" as const
export const CONFIG_OPT_NAME = "ExtractorPackConfigOptions" as const
export const DASH = "----------" as const
export const CONFIG_FILE = "configFile" as const
export const LOADER_JS_PATH = path.join(__dirname, "..", "loader", "index.js")
export const LOADER_TYPES_PATH = path.join(__dirname, "..", "loader", "index.d.ts")
export const DTS_BASE = `
import { Player } from "discord-player";

// ------- DYNAMIC OPTIONS -------
interface ExtractorPackConfigOptions {}

declare function load(player: Player): Promise<void>
declare function defineConfig(config: ExtractorPackConfigOptions): ExtractorPackConfigOptions
`.trim()
export const LOADER_JS_BASE = `
const path = require("path")

/**
 * Load extractors into the player
 * @param {import("discord-player").Player} player The player this config will load into
 */
async function load(player) {
    /**
     * LOADER FUNCTION TO LOAD EXTRACTORS INTO DISCORD PLAYER
     * 
     * player.extractors.register(ExtractorClass, options['extractor-package-name'])
     */
    const configFile = (await import(\`file://\${path.join(process.cwd(), "extractorpack.config.js")}\`)).default
}

/**
 * Define a configuration
 * @example
 * \`\`\`js
 * // extractorpack.config.mjs
 * export default defineConfig({
 *   "discord-player-youtubei": {
 *     cookie: "SomeCookieValue" 
 *   }
 * })
 * \`\`\`
 * @param {import("./index").ExtractorPackConfigOptions} options Options for the extractor
 * @returns 
 */
function defineConfig(options) {
    return options
}

module.exports = { load, defineConfig }
`.trim()
export const BASE_CONFIG_CONTENT = `
import { defineConfig } from "extractorpack"

export default defineConfig({})
`.trim()
export const CONFIG_FILE_NAME = "extractorpack.config.mjs"