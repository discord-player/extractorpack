#!/usr/bin/env node
import { program } from "commander"
import fs from "fs"
import path from "path"
import { addCommand, initCommand, removeCommand, scanCommand } from "./commands"
import { createWarnMessage } from "./utils"

const { version, name } = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")) as { version: string, name: string }

if(process.env.EXT_PACK_FETCH_LOCATION === "local") {
    console.warn(createWarnMessage(`Using a local file for valid extractors. This maybe outdated!`))
}

program
    .version(version)
    .name(name)

addCommand(program)
removeCommand(program)
initCommand(program)
scanCommand(program)

program.parse(process.argv)