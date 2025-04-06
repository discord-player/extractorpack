import { ERROR_LABEL, WARNING_LABEL } from "../Constants";

export function createWarnMessage(message: string) {
    return `${WARNING_LABEL}: ${message}`
}

export function createErrorMessage(message: string) {
    return `${ERROR_LABEL}: ${message}`
}