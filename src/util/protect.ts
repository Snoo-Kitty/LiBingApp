import "dotenv/config"
import {existsSync, readFileSync, writeFileSync} from "fs"
import {randomBytes} from "node:crypto"
import Logger from "./log"
import {appendFileSync} from "node:fs"

// this is the part where i edit this and pretended it was from mihoyo
export default class Protector {
	private static readonly logger: Logger = new Logger(`PROT`)
	private static SEED: Buffer
	public static PROTECT: boolean

	public static async init() {
		this.PROTECT = process.env.PROTECT === `true`
		if (this.PROTECT) {
			let seed = process.env.SEED
			if (!seed) {
				seed = randomBytes(16).toString("hex")
				appendFileSync(`.env`, `\nSEED=${seed}`, `utf-8`)
				process.env.SEED = seed
			}
			this.SEED = Buffer.from(seed, "hex")
		}
		this.logger.log(`Initialized`)
	}

	public static decode(data: Uint8Array) {
		if (!this.PROTECT) return JSON.parse(Buffer.from(data).toString())
		const input = Buffer.from(data)
		const output = Buffer.alloc(input.length)
		for (let i = 0; i < input.length; i++) output[i] = input[i]! ^ this.SEED[i % this.SEED.length]!
		return JSON.parse(output.toString())
	}

	public static encode(data: Object) {
		const buffer = Buffer.from(JSON.stringify(data))
		if (!this.PROTECT) return Buffer.from(buffer)
		const out = Buffer.alloc(buffer.length)
		for (let i = 0; i < buffer.length; i++) out[i] = buffer[i]! ^ this.SEED[i % this.SEED.length]!
		return out
	}
}
