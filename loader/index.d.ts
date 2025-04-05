import { Player } from "discord-player";

// ------- DYNAMIC OPTIONS -------
interface ExtractorPackConfigOptions {}

declare function load(player: Player): Promise<void>
declare function defineConfig(config: ExtractorPackConfigOptions): ExtractorPackConfigOptions