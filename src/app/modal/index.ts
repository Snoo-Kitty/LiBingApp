import {MessageFlags, ModalSubmitInteraction, User} from "discord.js"
import Logger from "../../util/log"
import {createRequire} from "module"
import path from "node:path"
import InteractionCreateEvent from "../../events/evt/interaction"
import {existsSync} from "node:fs"

export default class ModalHandler {
	public static readonly logger: Logger = new Logger(`MDL`)
	public static modals: {id: string; intId: string; handler: Function; timeout: NodeJS.Timeout}[] = []

	public static async event(interaction: ModalSubmitInteraction) {
		const customId = Buffer.from(interaction.customId, "base64").toString(`utf-8`)
		const [id, intId] = customId.split(`_`)
		if (!id || !intId) return
		const handler = this.modals.find((s) => s.id === id && s.intId === intId)
		if (!handler) return interaction.reply({content: `This modal has expired.`, flags: MessageFlags.Ephemeral})
		clearTimeout(handler.timeout)
		this.modals = this.modals.filter((s) => s !== handler)
		await handler.handler(interaction)
	}

	public static async addNewModal(id: string, intId: string) {
		const mdl = path.join(__dirname, `modals/${id}.js`)
		if (!existsSync(mdl)) {
			this.logger.err(`No such ${mdl}`)
			return
		}
		const require = createRequire(__filename)
		const mod = require(mdl).default
		const btncl = new mod(id, intId)
		const timeout = setTimeout(
			() => {
				this.modals = this.modals.filter((s) => s.intId !== intId || s.id !== id)
			},
			3 * 60 * 1000,
		)

		this.modals.push({id, intId, handler: btncl.manage.bind(btncl), timeout})
		this.logger.log("New modal instance was made")
	}

	public static async init() {
		InteractionCreateEvent.bindModal(this.event.bind(this))
		this.logger.log("ModalHandlerZaiTaoBaoKeYiMaiLe!!!!")
	}
}
