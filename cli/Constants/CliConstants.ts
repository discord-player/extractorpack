import type { Spinner } from "ora-classic";
import ansi from "ansi-colors";

export const ORA_FRAMES_BLUE: Spinner = {
    frames: [
        ansi.bold(`${ansi.blue("˃")}˃˃`),
        ansi.bold(`˃${ansi.blue("˃")}˃`),
        ansi.bold(`˃˃${ansi.blue("˃")}`),
    ]
} as const

export const WARNING_LABEL = ansi.bgYellow(" WARNING ")