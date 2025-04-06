import { Command } from "commander";
import { existsSync } from "node:fs";
import path from "node:path";
import { createErrorMessage, createWarnMessage } from "../utils";
import { writeFile } from "node:fs/promises";
import { BASE_CONFIG_CONTENT, CONFIG_FILE_NAME } from "../Constants";
import { scanAndWrite } from "./scan";

export function initCommand(program: Command) {
    program
        .command("init")
        .option("-f, --force", "Disable recommended protections")
        .action(async (force?: boolean) => {
            if(force) console.warn(createWarnMessage("Using the --force flag. Recommended protections disabled"))
            if(!force && existsSync(path.join(process.cwd(), "extractorpack.config.mjs"))) {
                console.error(createErrorMessage("An `extractorpack.config.mjs` already exists"))
                process.exit(1)
            }

            await writeFile(path.join(process.cwd(), CONFIG_FILE_NAME), BASE_CONFIG_CONTENT)
            console.log("ℹ️ Created an extractorpack.config.mjs in your root directory")
            await scanAndWrite()
        })
}