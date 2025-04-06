import { Command } from "commander";
import { createErrorMessage, createWarnMessage, getManager, PackageManagers } from "../utils";
import { existsSync, writeFileSync } from "fs";
import path from "path";
import ora from "ora-classic";
import { CONFIG_OPT_NAME, DASH, LOADER_JS_PATH, LOADER_TYPES_PATH, ORA_FRAMES_BLUE } from "../Constants";
import { execSync } from "child_process";
import { Project } from "ts-morph";

function buildRemoveCommand(manager: PackageManagers, extractor: string) {
    if(['deno', 'npm'].includes(manager)) return `${manager} uninstall ${extractor}`
    return `${manager} remove ${extractor}`
}

export function removeCommand(program: Command) {
    program
        .command("remove")
        .argument("<extractor>", "The extractor to remove")
        .action((extractor: string) => {
            const manager = getManager()
            const doesPackageExists = existsSync(path.join(process.cwd(), "node_modules", extractor))

            if(!doesPackageExists) {
                console.log(createErrorMessage(`The extractor ${extractor} is not installed`))
                process.exit(1)
            }

            const removeCommand = buildRemoveCommand(manager, extractor)

            const uninstallSpinner = ora({
                spinner: ORA_FRAMES_BLUE,
                text: `Uninstalling ${extractor} ...`
            }).start()

            execSync(removeCommand)

            uninstallSpinner.stopAndPersist({
                symbol: "✅",
                text: `Finished Uninstalling ${extractor}`
            })

            const editorSpinner = ora({
                spinner: ORA_FRAMES_BLUE,
                text: "Editing loaders"
            }).start()

            const project = new Project({
                skipAddingFilesFromTsConfig: true,
                skipLoadingLibFiles: true,
                skipFileDependencyResolution: true
            })
            
            const loaderJs = project.addSourceFileAtPath(LOADER_JS_PATH)

            const fn = loaderJs.getFunctionOrThrow("load")
            
            const body = fn.getBodyText()!
            const bodySplit = body.split("\n")
            const [start, end] = [
                bodySplit.findIndex((v) => v === `${DASH} START ${extractor} ${DASH}`),
                bodySplit.findIndex((v) => v === `${DASH} END ${extractor} ${DASH}`)
            ]

            if(!start || !end) console.warn(createWarnMessage("Cannot find the code block for the extractor"))
            else {
                bodySplit.slice(start, end)
            }

            const moddedBody = bodySplit.join("\n")

            fn.setBodyText(moddedBody.trim())

            writeFileSync(LOADER_JS_PATH, loaderJs.getText().trim())

            const loaderTs = project.addSourceFileAtPath(LOADER_TYPES_PATH)

            const types = loaderTs.getInterfaceOrThrow(CONFIG_OPT_NAME)
            const property = types.getPropertyOrThrow(`"${extractor}"`)

            property.remove()

            const importDec = loaderTs.getImportDeclaration((v) => v.getModuleSpecifier().getText(false).trim() === extractor)
            importDec?.remove()

            writeFileSync(LOADER_TYPES_PATH, loaderTs.getText().trim())

            editorSpinner.stopAndPersist({
                symbol: "✅",
                text: `Finished removing loader pieces for ${extractor}`
            })
        })
}