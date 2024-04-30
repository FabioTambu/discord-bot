const { SlashCommandBuilder } = require('@discordjs/builders');
const { errors, createSuccessMessage } = require('../../global');
const { writeTag } = require('../../brawl-functions/handleBrawlTag');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Associate your brawl stars tag with your discord id')
    .addStringOption(option => option.setName('tag').setDescription('Insert your brawl stars tag').setRequired(true)),

    async execute (interaction, client) {
        const user = interaction.user;
        const tag = interaction.options.getString('tag');
 
        try {
            writeTag(user.id, tag)
            await interaction.reply({embeds: [createSuccessMessage('**Tag Updated!**')]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}