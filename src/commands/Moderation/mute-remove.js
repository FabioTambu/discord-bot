const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('umute')
    .setDescription('Unmute a user')
    .addUserOption(option => option.setName('user').setDescription('Mention the user you want to unmute').setRequired(true)),

    async execute (interaction, client) {
        const user = interaction.options.getMember('user');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        if (!user.isCommunicationDisabled()) return await interaction.reply({ embeds: [createErrorMessage('**This user is not muted!**')], ephemeral: true });

        user.timeout(1);
        await interaction.reply({embeds: [createSuccessMessage(`**${user.user.globalName}** has been **unmuted!**`)]});
    }
}