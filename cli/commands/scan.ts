import { Command } from "commander";
import ora from "ora-classic";
import { DTS_BASE, LOADER_JS_BASE, LOADER_JS_PATH, LOADER_TYPES_PATH, ORA_FRAMES_BLUE } from "../Constants";
import { modifyCode, scanCompatibleExtractors } from "../utils";
import ansiColors from "ansi-colors";
import { writeFile } from "fs/promises";

export async function scanAndWrite() {
    const scanSpinner = ora({
        spinner: ORA_FRAMES_BLUE,
        text: "Scanning for compatible extractors ..."
    }).start()

    const extractors = await scanCompatibleExtractors()
    if(extractors.length === 0) {
        scanSpinner.stopAndPersist({
            symbol: "ℹ️",
            text: "Found 0 compatible extractors"
        })
        return;
    }

    scanSpinner.text = `Found ${ansiColors.bold(extractors.length.toString())} extractor(s). Writing code ...`

    // rest all the code
    await Promise.all([
        writeFile(LOADER_JS_PATH, LOADER_JS_BASE),
        writeFile(LOADER_TYPES_PATH, DTS_BASE)
    ])

    for(const extractor of extractors) {
        scanSpinner.text = `Writing code for ${ansiColors.bold(extractor)} ...`
        modifyCode(extractor)
    }
}

export function scanCommand(program: Command) {
    program
        .command("scan")
        .action(async () => {
            await scanAndWrite()
        })
}