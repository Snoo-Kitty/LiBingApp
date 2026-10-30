import { ButtonInteraction, LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js"
import ModalHandler from "../../modal"

export default class HYLAccountLink {

    public readonly id: string
    public readonly authorId: string

    constructor(id: string, authorId: string) {
        this.id = id,
        this.authorId = authorId
    }

    public async manage(interaction: ButtonInteraction, ...args: string[]) {
        const modal = new ModalBuilder().setTitle(`Link your HoyoLab Account`)
        .setCustomId(Buffer.from(`link_${interaction.id}`, "utf-8").toString('base64'))
        .addLabelComponents(
            new LabelBuilder()
            .setLabel(`Token`)
            .setTextInputComponent(
                new TextInputBuilder()
                .setCustomId(`token`)
                .setPlaceholder(`My token asf af`)
                .setStyle(TextInputStyle.Short),
            ),
            new LabelBuilder()
            .setLabel(`Account Id`)
            .setTextInputComponent(
                new TextInputBuilder()
                .setCustomId(`aid`)
                .setPlaceholder(`My aid asf af`)
                .setStyle(TextInputStyle.Short),
            )

        )
        ModalHandler.addNewModal(`link`, interaction.id)
        return await interaction.showModal(modal)
    }

}