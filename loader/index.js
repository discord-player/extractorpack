const path = require("path")

async function load(player) {
    /**
     * LOADER FUNCTION TO LOAD EXTRACTORS INTO DISCORD PLAYER
     * 
     * player.extractors.register(ExtractorClass, options['extractor-package-name'])
     */
    const configFile = (await import(`file://${path.join(process.cwd(), "extractorpack.config.js")}`)).default
}

function defineConfig(options) {
    return options
}

module.exports = { load, defineConfig }