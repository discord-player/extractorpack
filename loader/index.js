/**
 * THIS IS AN AUTO GENERATED FILE. DO NOT EDIT UNLESS YOU KNOW WHAT YOU'RE DOING
 */
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
    const configFile = (await import(`file://${path.join(process.cwd(), "extractorpack.config.js")}`)).default
}

/**
 * Define a configuration
 * @example
 * ```js
 * // extractorpack.config.mjs
 * export default defineConfig({
 *   "discord-player-youtubei": {
 *     cookie: "SomeCookieValue" 
 *   }
 * })
 * ```
 * @param {import("./index").ExtractorPackConfigOptions} options Options for the extractor
 * @returns 
 */
function defineConfig(options) {
    return options
}

module.exports = { load, defineConfig }