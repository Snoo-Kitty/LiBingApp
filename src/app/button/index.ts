import {ButtonInteraction, MessageFlags, User} from "discord.js"
import Logger from "../../util/log"
import {createRequire} from "module"
import path from "node:path"
import InteractionCreateEvent from "../../events/evt/interaction"
import {existsSync} from "node:fs"
import {randomUUID} from "node:crypto"

export default class ButtonHandler {
	public static readonly logger: Logger = new Logger(`BTN`)
	public static buttonHandlers: {buttonId: string; authorId: string; handler: Function; token: string; restricted?: boolean; timeout: NodeJS.Timeout}[] = []

	public static async event(interaction: ButtonInteraction) {
		let customId: string
		try {
			customId = Buffer.from(interaction.customId, "base64").toString(`utf-8`)
		} catch {
			return
		}
		const [id, authorId, ...args] = customId.split(`_`)
		if (!id || !authorId) return
		const handler = this.buttonHandlers.find((s) => s.buttonId === id && s.authorId === authorId)
		if (!handler) return interaction.reply({content: `This button has expired.`, flags: MessageFlags.Ephemeral})
		if (handler.restricted && handler.authorId !== Buffer.from(interaction.user.id).toString("base64")) return interaction.reply({content: `greedy ho stop tryna eat up all the buttons`, flags: MessageFlags.Ephemeral})
		try {
			await handler.handler(interaction, ...args)
		} catch (err) {
			this.logger.err(`${err}`)
			if (!interaction.replied && !interaction.deferred) await interaction.reply({content: `oh no`, flags: MessageFlags.Ephemeral}).catch(() => {})
		}
	}

	public static async addButtonCache(id: string, author: User, restricted?: boolean) {
		const btn = path.join(__dirname, `buttons/${id}.js`)
		if (!existsSync(btn)) {
			this.logger.err(`No such ${btn}`)
			return
		}

		const require = createRequire(__filename)
		const mod = require(btn).default
		if (!mod || typeof mod !== `function`) {
			this.logger.err(`${btn} is not validity`)
			return
		}

		const authorId = Buffer.from(author.id).toString("base64")
		this.buttonHandlers = this.buttonHandlers.filter((s) => {
			if (s.buttonId !== id || s.authorId !== authorId) return true
			clearTimeout(s.timeout)
			return false
		})

		const btncl = new mod(id, authorId)
		const token = randomUUID()
		const timeout = setTimeout(
			() => {
				this.buttonHandlers = this.buttonHandlers.filter((s) => s.token !== token)
			},
			3 * 60 * 1000,
		)
		const restirct = restricted ?? true
		this.buttonHandlers.push({buttonId: id, authorId, handler: btncl.manage.bind(btncl), token, restricted: restirct, timeout})
		this.logger.log(`New button instance was made`)
		return authorId
	}

	public static async init() {
		InteractionCreateEvent.bindButton(this.event.bind(this))
		this.logger.log(`ButtonManager manages all buttons without interactionism`)
	}
}
