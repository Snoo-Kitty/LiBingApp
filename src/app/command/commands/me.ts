import {EmbedBuilder, Message} from "discord.js"
import UserData from "../../../res/user"

export default class MeCommand {
	public static readonly command: string = `Me Command`
	public static readonly description: string = `View your current data`
	public static readonly usage: string = `<PRE>me`
	public static readonly triggers: string[] = ["me"]
	public static readonly minimumArgs: number = 0

	public static async run(msg: Message, args: string[]) {
        const data = await UserData.get(msg.author.id)
        if (!data) return msg.reply(`You do not have any saved data yet`)
        const embed = new EmbedBuilder()
        .setTitle(msg.author.displayName)
        .setThumbnail(msg.author.displayAvatarURL())
        .setFields(
            {name: `HYL Linked?`, value: data.HoyoLabAccountId ? `Yes` : `No`},
            {name: `VoiceGuessrGame Wins`, value: data.VGGWins ? data.VGGWins.toString() : `None`}
        )
		return msg.reply({embeds: [embed]})
	}
}
