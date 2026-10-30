import {EmbedBuilder, Message} from "discord.js"
import app from "../../.."
import CommandHandler from ".."

export default class HelpCommand {
    public static readonly command: string = `Help Command`
    public static readonly description: string = `Get help`
    public static readonly usage: string = `<PRE>help`
    public static readonly triggers: string[] = ["help"]
    public static readonly minimumArgs: number = 0

    public static async run(msg: Message, args: string[]) {
        const bot = app.client.user!
        const embed = new EmbedBuilder()
        .setTitle(`${bot.displayName}'s commands!`)
        .setThumbnail(bot.displayAvatarURL())
        CommandHandler.commandList.forEach(s => {
            embed.addFields({name: s.name, value: `${s.description}\n${s.usage.replace(`<PRE>`, app.PREFIX)}\nAlias: ${s.triggers.join(', ')}`})
        })
        return msg.reply({embeds: [embed]})
    }
}
