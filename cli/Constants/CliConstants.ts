import type { Spinner } from "ora-classic";
import { bold } from "../utils";

export const ORA_FRAMES_BLUE: Spinner = {
    frames: [
        bold(`\x1B[34m˃\x1B[39m˃˃`),
        bold(`˃\x1B[34m˃\x1B[39m˃`),
        bold(`˃˃\x1B[34m˃\x1B[39m`),
    ]
} as const

export const WARNING_LABEL = '\x1B[43m \x1B[37m\x1B[1mWARNING\x1B[22m\x1B[39m \x1B[49m'
export const ERROR_LABEL = '\x1B[41m \x1B[37m\x1B[1mERROR\x1B[22m\x1B[39m \x1B[49m'