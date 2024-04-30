const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addStringOption(option => option.setName('user').setDescription('Mention the user you want to unban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Enter the reason for the unban')),

    async execute (interaction, client) {

        const userOption = interaction.options.getUser('user');
        const reasonOption = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ embeds: [errors.permission], ephemeral: true});

        try {
            const user = await interaction.guild.bans.fetch(userOption.id);

            if (!user) return interaction.reply({ embeds: [createErrorMessage('**This user is not banned!**')], ephemeral: true});

            await interaction.guild.bans.remove(userOption.id, reasonOption);
            await interaction.reply({ embeds: [createSuccessMessage(`**${user.user.tag}** has been successfully **unbanned\nReason**: ${reasonOption}`)]});
        } catch (err) {
            return interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true});
        }
    }
}