import path from "path"
export const CLASS_VAR = "EXTRACTOR_PACK_CLASS" as const
export const OPTIONS_VAR = 'EXTRACTOR_PACK_EXT_OPTIONS' as const
export const TYPES_VAR = "EXTRACTOR_PACK_TYPES" as const
export const CONFIG_OPT_NAME = "ExtractorPackConfigOptions" as const
export const DASH = "----------" as const
export const CONFIG_FILE = "configFile" as const
export const LOADER_JS_PATH = path.join(__dirname, "..", "loader", "index.js")
export const LOADER_TYPES_PATH = path.join(__dirname, "..", "loader", "index.d.ts")