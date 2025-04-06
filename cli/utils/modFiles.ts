import path from "path";
import fs from "fs"
import { Project, SyntaxKind } from "ts-morph";
import { CLASS_VAR, CONFIG_FILE, CONFIG_OPT_NAME, DASH, OPTIONS_VAR, LOADER_JS_PATH, LOADER_TYPES_PATH } from "../Constants";

export function modifyCode(packageName: string) {
    let configPath = path.join(process.cwd(), "node_modules", packageName, "extractorpack.extconfig.mjs")
    if(!fs.existsSync(configPath)) configPath = path.join(process.cwd(), "node_modules", packageName, "extractorpack.extconfig.cjs")
    if(!fs.existsSync(configPath)) configPath = path.join(process.cwd(), "node_modules", packageName, "extractorpack.extconfig.js")
    if(!fs.existsSync(configPath)) configPath = path.join(process.cwd(), "node_modules", packageName, "extractorpack.extconfig.ts")
    if(!fs.existsSync(configPath)) throw new Error(`Configuration files for extractorpack not found for ${packageName}`)

    const project = new Project({
        skipLoadingLibFiles: true,
        skipFileDependencyResolution: true,
        skipAddingFilesFromTsConfig: true
    })

    const configFile = project.addSourceFileAtPath(configPath)

    const [
        mainClass,
        options
    ] = [
        configFile.getVariableDeclarationOrThrow(CLASS_VAR),
        configFile.getVariableDeclarationOrThrow(OPTIONS_VAR)
    ].map(v => v.getInitializerIfKindOrThrow(SyntaxKind.StringLiteral).getText(false).slice(1, -1))

    const loaderJs = project.addSourceFileAtPath(LOADER_JS_PATH)
    
    const fn = loaderJs.getFunctionOrThrow("load")

    let isBodyWritten = false

    const body = fn.getBodyText()!
    const start = `// ${DASH} START ${packageName} ${DASH}`
    const importDeclar = `const { ${mainClass} } = await import("${packageName}");`
    const playerRegister = `player.extractors.register(${mainClass}, ${CONFIG_FILE}["${packageName}"]);`
    const end = `// ${DASH} END ${packageName} ${DASH}`

    if(!body.includes(start) && !body.includes(end)) {
        const moddedBody = `${body}\n${start}\n${importDeclar}\n${playerRegister}\n${end}`
    
        fn.setBodyText(moddedBody)
    
        fs.writeFileSync(LOADER_JS_PATH, loaderJs.getText(true))

        isBodyWritten = true
    }

    let isTypesWritten = false

    const loaderTypes = project.addSourceFileAtPath(LOADER_TYPES_PATH)

    const modTypes = loaderTypes.getInterfaceOrThrow(CONFIG_OPT_NAME)

    const prop = modTypes.getProperty(`"${packageName}"`)

    if(!prop) {
        loaderTypes.addImportDeclaration({
            namedImports: [options],
            moduleSpecifier: packageName
        })
        
        modTypes.addProperty({
            name: `"${packageName}"`,
            type: options
        })
    
        fs.writeFileSync(LOADER_TYPES_PATH, loaderTypes.getText())

        isTypesWritten = true
    }

    return { isBodyWritten, isTypesWritten }
}