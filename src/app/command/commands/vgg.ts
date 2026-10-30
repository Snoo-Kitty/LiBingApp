import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message} from "discord.js"
import VoiceGuessGame from "../../game/voiceguess"
import ButtonHandler from "../../button"

export default class VGGCommand {
	public static readonly command: string = `Voiceline guessr`
	public static readonly description: string = `Guess the genshin character's voiceline!`
	public static readonly usage: string = `<PRE>vgg`
	public static readonly triggers: string[] = ["vgg"]
	public static readonly minimumArgs: number = 0
	public static readonly onGoingGames: VoiceGuessGame[] = []

	public static async run(msg: Message, args: string[]) {
		const existingGame = this.onGoingGames.find((s) => s.gameId === msg.author.id)
		if (existingGame) return msg.reply(`You currently have one ongoing game, please finish it first.`)
		const game = new VoiceGuessGame(msg)
		this.onGoingGames.push(game)
		await game.start(msg)
	}
}
