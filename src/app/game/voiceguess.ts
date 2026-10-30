import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, EmbedBuilder, Message, User} from "discord.js"
import Logger from "../../util/log"
import VGGResource from "../../res/vgg"
import ButtonHandler from "../button"
import CommandHandler from "../command"
import UserData from "../../res/user"

export default class VoiceGuessGame {
	private readonly logger: Logger = new Logger(`VGG`)
	private timeout: NodeJS.Timeout | undefined
	public readonly gameId: string
	public readonly guessLine: string
	public readonly lineAbout: string
	public readonly character: string
	public readonly difficulty: number
	public readonly author: User
	public initial: Message | undefined
	private ended: boolean = false
	public guessList: string[] = []

	constructor(message: Message) {
		this.author = message.author
		const lineInfo = VGGResource.getRandomLine()
		this.guessLine = lineInfo.dialogue
		this.character = lineInfo.character
		this.lineAbout = lineInfo.about
		this.difficulty = (100 / lineInfo.dialogue.length) * 10
		this.gameId = message.author.id
	}

	public async start(msg: Message) {
		const embed = new EmbedBuilder()
			.setTitle(`Guess the voiceline:`)
			.setDescription(this.guessLine)
			.setFooter({text: `Length Difficulty: ${this.difficulty.toFixed(2)}%`})
			.setColor(`#3489eb`)
		const authorId = await ButtonHandler.addButtonCache(`guess`, msg.author, false)
		const guessBtn = new ButtonBuilder()
			.setCustomId(Buffer.from(`guess_${authorId}_${this.gameId}`, "utf-8").toString("base64"))
			.setStyle(ButtonStyle.Primary)
			.setLabel(`Guess`)
		const ends = Math.floor((Date.now() + 3 * 60 * 1000) / 1000)
		const message = await msg.reply({
			embeds: [embed],
			content: `${msg.author.displayName} started a new voiceline guessr!\nMatch ends <t:${ends}:R>`,
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(guessBtn)],
		})
		this.initial = message
		this.timeout = setTimeout(
			async () => {
				if (this.initial) {
					await this.initial.edit({content: `Time's up! The answer was **${this.character}**.`, components: []})
				}
				this.end()
			},
			3 * 60 * 1000,
		)
	}

	public end() {
		if (this.timeout) clearTimeout(this.timeout)
		const vggcommandclass = CommandHandler.commandList.find((s) => s.command === `Voiceline guessr`)!
		const index = vggcommandclass.onGoingGames.indexOf(this)
		if (index !== -1) vggcommandclass.onGoingGames.splice(index, 1)
	}

	public async guess(guesser: User, character: string) {
		if (this.ended) return false
		this.guessList.push(`${guesser.displayName} guessed **${character}**`)
		if (character.trim().toLowerCase() !== this.character.trim().toLowerCase()) return false
		this.ended = true
		void (async () => {
			const user = (await UserData.get(guesser.id)) ?? {}
			user.VGGWins = (user.VGGWins ?? 0) + 1
			await UserData.save(user, guesser.id)
		})()
		if (this.initial!.channel.isSendable()) {
			const embed = new EmbedBuilder()
				.setColor(`#3489eb`)
				.setTitle(`MATCH RESULT / There were ${this.guessList.length} guesses!`)
				.addFields({name: `Line`, value: this.guessLine, inline: true}, {name: `Character`, value: this.character, inline: true})
				.setFooter({text: `Length Difficulty: ${this.difficulty.toFixed(2)}`})
				.setDescription(this.guessList.join("\n"))
			this.initial!.channel.send({
				content: `${guesser.displayName} has won the game! It was **${character}**!`,
				embeds: [embed],
			})
		}
		this.initial!.delete()
		return true
	}
}
