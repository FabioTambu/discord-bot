const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(option => option.setName('user').setDescription('Mention the user you want to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Enter the reason for the kick')),

    async execute (interaction) {
        const { options, member } = interaction;
        const user = options.getMember('user');
        const reason = options.getString('reason') || 'No reason provided';

        if (!member.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        if (user.id == member.id) return await interaction.reply({ embeds: [errors.sameID], ephemeral: true});

        try {
            user.kick(reason);
            await interaction.reply({embeds: [createSuccessMessage(`**${user.user.globalName}** has been kicked!`)]});
        } catch (err) {
            console.log(err);
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}