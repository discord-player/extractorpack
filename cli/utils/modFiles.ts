import path from "path";
import fs from "fs"
import { Project, SyntaxKind } from "ts-morph";
import { CLASS_VAR, CONFIG_FILE, CONFIG_OPT_NAME, DASH, OPTIONS_VAR, TYPES_VAR } from "../Constants";

const LOADER_JS_PATH = path.join(__dirname, "..", "loader", "index.js")
const LOADER_TYPES_PATH = path.join(__dirname, "..", "loader", "index.d.ts")

export async function modifyCode(packageName: string) {
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

    const body = fn.getBodyText()
    const start = `// ${DASH} START ${packageName} ${DASH}`
    const importDeclar = `const { ${mainClass} } = await import("${packageName}");`
    const playerRegister = `player.extractors.register(${mainClass}, ${CONFIG_FILE}["${packageName}"]);`
    const end = `// ${DASH} END ${packageName} ${DASH}`
    const moddedBody = `${body}\n${start}\n${importDeclar}\n${playerRegister}\n${end}`
    
    fn.setBodyText(moddedBody)

    fs.writeFileSync(LOADER_JS_PATH, loaderJs.getText(true))

    const loaderTypes = project.addSourceFileAtPath(LOADER_TYPES_PATH)

    loaderTypes.addImportDeclaration({
        namedImports: [options],
        moduleSpecifier: packageName
    })

    const modTypes = loaderTypes.getInterfaceOrThrow(CONFIG_OPT_NAME)

    modTypes.addProperty({
        name: `"${packageName}"`,
        type: options
    })

    fs.writeFileSync(LOADER_TYPES_PATH, loaderTypes.getText())
}