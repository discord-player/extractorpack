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
    const f = await fetch(EXTRACTOR_RAW)
    if(!f.ok) throw new Error("ERROR fetching list of extractor from GitHub. Please try again")
    return f.json() as Promise<Extractors>
}