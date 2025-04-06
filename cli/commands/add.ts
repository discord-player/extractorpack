import type { Command } from "commander";
import { bold, createErrorMessage, createWarnMessage, ExtractorData, getAllExtractors, getManager, PackageManagers } from "../utils";
import { execSync } from "child_process";
import { modifyCode } from "../utils";
import ora from "ora-classic";
import { ORA_FRAMES_BLUE, SUPPORTED_VERSIONS, USE_GITHUB_VERSION } from "../Constants";

function buildInstallCommand(manager: PackageManagers, pkg: ExtractorData, version?: string): `${PackageManagers} ${"install" | "add"} ${string}@${string}` {
    if (version) {
        if (!SUPPORTED_VERSIONS.includes(version)) console.warn(createWarnMessage(`Using the raw version ${version}`))
        else {
            if (version === "experimental" && pkg.experimental === USE_GITHUB_VERSION) version = pkg.github
            // @ts-expect-error
            else version = pkg[version]
        }
    } else version = "latest"
    if (["bun", "npm"].includes(manager)) return `${manager} install ${pkg.name}@${version}`
    if (manager === "deno") return `deno install npm:${pkg.name}@${version}`
    return `${manager} add ${pkg.name}@${version}`
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
            if (!ext) {
                console.log(createErrorMessage(`Extractor \`${extractor}\` is not a valid extractorpack extractor`))
                process.exit(1)
            }

            const installCmd = buildInstallCommand(getManager(), ext, options.version)

            const displayExt = `${options.version ? `@${options.version}` : ""}`

            const installSpinner = ora({
                text: `Installing ${bold(displayExt)} ...`,
                spinner: ORA_FRAMES_BLUE
            }).start()

            execSync(installCmd, {
                cwd: process.cwd()
            })

            installSpinner.stopAndPersist({
                text: `Installed ${bold(displayExt)}`,
                symbol: "✅"
            })

            const modSpinner = ora({
                text: "Modding interal types for intellisense and loader for discord-player ...",
                spinner: ORA_FRAMES_BLUE
            }).start()

            const { isBodyWritten, isTypesWritten } = modifyCode(extractor)

            let message = `Wrote new types to ${bold("/loader/index.d.ts")} and new code to ${bold("/loader/index.js")}`

            if(isBodyWritten && isTypesWritten) message = `Wrote new types to ${bold("/loader/index.d.ts")} and new code to ${bold("/loader/index.js")}`
            else if(isBodyWritten) message = `Wrote new code to ${bold("/loader/index.js")}`
            else if(isTypesWritten) message = `Wrote new types to ${bold("/loader/index.d.ts")}`
            else message = `${bold("No types or body")} were written as they already exists. This is possibly due to running the install command multiple times`

            modSpinner.stopAndPersist({
                text: message,
                symbol: "✅"
            })
        })
}