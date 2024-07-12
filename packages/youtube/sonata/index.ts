import { BasePlugin } from "sonata.js"
import { Innertube } from "youtubei.js"

export interface YoutubePluginOptions {
    authentication: string;
}

export class YoutubeSonataPlugin extends BasePlugin<YoutubePluginOptions> {
    tube!: Innertube

    async init(): Promise<void> {
        this.tube = await Innertube.create()
    }
}