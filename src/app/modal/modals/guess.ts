import {ButtonInteraction, LabelBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle, User} from "discord.js"
import UserData from "../../../res/user"
import CommandHandler from "../../command"
import VoiceGuessGame from "../../game/voiceguess"

export default class VGGGuessModal {
	public readonly id: string
	// GAME ID
	public readonly intId: string

	constructor(id: string, intId: string) {
		;((this.id = id), (this.intId = intId))
	}

	public async manage(interaction: ModalSubmitInteraction) {
		const guessed = interaction.fields.getTextInputValue(`character`)
		const vggcommandclass = CommandHandler.commandList.find((s) => s.command === `Voiceline guessr`)!
		const game = vggcommandclass.onGoingGames.find((s: VoiceGuessGame) => s.gameId === this.intId)
		if (!game) return await interaction.reply({content: `The game has ran out of time, better luck next time!`, flags: MessageFlags.Ephemeral})
		const guess = await game.guess(interaction.user, guessed)
		if (guess) await game.end()
		return await interaction.reply({
			content: `${guess ? `You guessed it!` : `It wasn't it...`}`,
			flags: MessageFlags.Ephemeral,
		})
	}
}
