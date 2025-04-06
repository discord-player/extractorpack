import { readdir } from "fs/promises";
import path from "path";
import { getAllExtractors } from "./getAllExtractors";

export async function scanCompatibleExtractors() {
    const [allExt, allDir] = await Promise.all([
        getAllExtractors(),
        readdir(path.join(process.cwd(), "node_modules"))
    ])

    const allExtNames = allExt.extractors.map(v => v.name)
    const allValidExt = allDir.filter(v => allExtNames.includes(v))

    return allValidExt
}