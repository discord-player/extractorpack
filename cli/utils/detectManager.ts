import fs from "fs"
import path from "path"

const LOCK_FILES = [
    {
        name: "pnpm-lock.yml",
        manager: "pnpm"
    },
    {
        name: "yarn.lock",
        manager: "yarn"
    },
    {
        name: "package-lock.json",
        manager: "npm"
    }
]

export type PackageManagers = "yarn"|"pnpm"|"npm"

export function detectManager(): PackageManagers {
    let pkgJson: { packageManager?: string } | undefined
    try {
        pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"))
    } catch {
        pkgJson = undefined
    }

    if(pkgJson && pkgJson.packageManager) {
        const [manager] = pkgJson.packageManager.split("@")
        if(manager && LOCK_FILES.map((v) => v.name).includes(manager)) return manager as PackageManagers
    }

    for(const lock of LOCK_FILES) {
        if(fs.existsSync(path.join(process.cwd(), lock.name))) return lock.manager as PackageManagers
    }

    return "npm"
}

let manager: PackageManagers|undefined = undefined

export function getManager() {
    if(!manager) manager = detectManager()
    return manager
}