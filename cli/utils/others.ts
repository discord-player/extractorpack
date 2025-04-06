import { WARNING_LABEL } from "../Constants";

export function createWarnMessage(message: string) {
    return `${WARNING_LABEL}: ${message}`
}