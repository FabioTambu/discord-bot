const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addIntegerOption(option => option
        .setName('delete-messages')
        .setDescription('Decide how many messages to delete from the user who will be banned')
        .setRequired(true)
        .addChoices(
            {name: 'Nothing', value: 0},
            {name: '1 hour', value: 1 * 60 * 60},
            {name: '2 hours', value: 2 * 60 * 60},
            {name: '3 hours', value: 3 * 60 * 60},
            {name: '6 hours', value: 6 * 60 * 60},
            {name: '12 hours', value: 12 * 60 * 60},
            {name: '1 day', value: 1 * 24 * 60 * 60},
            {name: '2 days', value: 2 * 24 * 60 * 60},
            {name: '3 days', value: 3 * 24 * 60 * 60},
            {name: '7 days', value: 7 * 24 * 60 * 60},
            {name: '14 days', value: 14 * 24 * 60 * 60}
        )
    )
    .addUserOption(option => option.setName('user').setDescription('Mention the user you want to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Enter the reason for the ban')),

    async execute (interaction, client) {
        const user = interaction.options.getMember('user');
        const deleteMessages = interaction.options.getInteger('delete-messages');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        if (user.id == interaction.member.id) return await interaction.reply({ embeds: [errors.sameID], ephemeral: true});

        try {
            user.ban({deleteMessageSeconds: deleteMessages, reason: reason});
            await interaction.reply({embeds: [createSuccessMessage(`**${user.user.globalName}** has been **banned\nReason**: ${reason}`)]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}