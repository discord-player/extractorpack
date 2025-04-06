#!/usr/bin/env node
import { program } from "commander"
import fs from "fs"
import path from "path"
import { addCommand, removeCommand } from "./commands"

const { version, name } = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")) as { version: string, name: string }

program
    .version(version)
    .name(name)

addCommand(program)
removeCommand(program)

program.parse(process.argv)