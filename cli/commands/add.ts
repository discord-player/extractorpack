import type { Command } from "commander";
import { getAllExtractors, getManager, PackageManagers } from "../utils";
import { execSync } from "child_process";
import { modifyCode } from "../utils/modFiles";

function buildInstallCommand(manager: PackageManagers, pkg: string, version?: string): `${PackageManagers} ${"install"|"add"} ${string}@${string}` {
    if(manager === "npm") return `npm install ${pkg}@${version}`
    return `${manager} add ${pkg}@${version}`
}

export function addCommand(program: Command) {
    program
        .command("add")
        .description("Add a compatible extractor from extractorpack")
        .argument("<extractor>", "The name of the extractor to install")
        .option("-v, --version <version>", "The version of extractor to install")
        .action(async (extractor: string, options: { version?: string }) => {
            const allExt = await getAllExtractors()
            const ext = allExt.extractors.find(v => v.name === extractor)
            if(!ext) {
                console.log(`Extractor \`${extractor}\` is not a valid extractorpack extractor`)
                process.exit(1)
            }

            const installCmd = buildInstallCommand(getManager(), extractor, options.version)

            const displayExt = `${options.version ? `@${options.version}` : ""}`

            console.log(`Installing ${displayExt}`)

            execSync(installCmd)

            console.log(`Finished installing ${displayExt}`)
            console.log("Applying code config")

            modifyCode(extractor)
        })
}