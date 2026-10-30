import {existsSync, mkdirSync, readdirSync, readFileSync} from "node:fs"
import {VGGItem} from "../types/vgg"
import Logger from "../util/log"
import path from "node:path"

export default class VGGResource {
	private static readonly directory: string = `resources/app/game`
	private static readonly logger: Logger = new Logger(`VGGRes`)
	public static VGGResources: VGGItem[] | undefined
    public static characters: string[]

	public static get() {
		if (this.VGGResources) return this.VGGResources
		this.logger.log(`Loading resources for the initial run...`)
		this.VGGResources = []
        this.characters = []
		if (!existsSync(this.directory)) {
			mkdirSync(this.directory)
			this.logger.warn(`There are no VGG resources.`)
		}
		const characterFiles = readdirSync(this.directory)
		let entries = 0
		characterFiles.forEach((s, i) => {
			const data = JSON.parse(readFileSync(path.join(this.directory, s), {encoding: "utf-8"}))
			this.VGGResources!.push(data)
            this.characters.push(data.character)
			entries += 1
		})
		this.logger.log(`Loaded ${entries} entries!`)
		return this.VGGResources
	}

	public static rand(arr: Array<string>) {
		return arr[Math.floor(Math.random() * arr.length)] ?? "Hello"
	}

	public static getRandomLine() {
		const data = this.get()
		const character = this.rand(this.characters)
		const section = Math.random() > 0.5 ? "Story" : "Combat"
		const voiceLineData = data.find((s) => s.character === character)!.sections[section]
		const line = this.rand(Object.keys(voiceLineData))
		let dialogue
		const voiceline = voiceLineData[line as keyof typeof voiceLineData]
		if (typeof voiceline === "string") {
			dialogue = voiceline
		} else if (typeof voiceline === "object") {
			dialogue = this.rand(voiceline)
		}
        if (!dialogue) dialogue = `DIALOGUE NOT FOUND`
        return {
            character,
            about: line,
            dialogue
        }
	}
}
