const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-nickname')
    .setDescription('Remove the nickname to a user')
    .addUserOption(option => option.setName('user').setDescription('Mention the user whose nickname you want to remove').setRequired(true)),

    async execute (interaction, client) {
        const user = interaction.options.getMember('user');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        if (!user.nickname) return await interaction.reply({ embeds: [createErrorMessage('**This user haven\'t a nickname!**')], ephemeral: true});

        try {
            await user.setNickname(null);
            await interaction.reply({embeds: [createSuccessMessage('**Nickname Removed!**')]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}