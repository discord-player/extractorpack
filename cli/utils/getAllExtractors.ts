import { readFileSync } from "fs";
import { createWarnMessage } from "./others";
import path from "path";

const EXTRACTOR_RAW = "https://raw.githubusercontent.com/discord-player/extractorpack/refs/heads/main/COMPATIBLE_EXT.json"
export type ExtractorData = {
    name: string,
    github: string,
    stable: string,
    beta: string,
    experimental: "EXT_PACK_USE_GIT"|string
}
export type Extractors = {
    version: string;
    extractors: ExtractorData[]
}

export async function getAllExtractors() {
    if(process.env.EXT_PACK_FETCH_LOCATION === "local") {
        console.warn(createWarnMessage(`Using a local file for valid extractors. This maybe outdated!`))
        return JSON.parse(readFileSync(path.join(__dirname, "..", "..", "COMPATIBLE_EXT.json"), "utf8")) as Extractors
    }
    const f = await fetch(EXTRACTOR_RAW)
    if(!f.ok) throw new Error("ERROR fetching list of extractor from GitHub. Please try again")
    return f.json() as Promise<Extractors>
}