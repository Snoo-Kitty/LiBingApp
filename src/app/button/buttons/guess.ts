import {ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js"
import ModalHandler from "../../modal"
import VGGResource from "../../../res/vgg"

export default class VGGGuessBtn {
	public readonly id: string
	public readonly authorId: string

	constructor(id: string, authorId: string) {
		;((this.id = id), (this.authorId = authorId))
	}

	public async manage(interaction: ButtonInteraction, ...args: string[]) {
		const char = VGGResource.rand(VGGResource.characters) // might hello
		//Hi
		const gameId = args[0]!
		const modal = new ModalBuilder()
			.setTitle(`Guess the character!`)
			.setCustomId(Buffer.from(`guess_${gameId}`, "utf-8").toString("base64"))
			.addLabelComponents(new LabelBuilder().setLabel(`Character`).setTextInputComponent(new TextInputBuilder().setCustomId(`character`).setPlaceholder(`Is it ${char}...?`).setStyle(TextInputStyle.Short)))
		ModalHandler.addNewModal(`guess`, gameId)
		return await interaction.showModal(modal)
	}
}
