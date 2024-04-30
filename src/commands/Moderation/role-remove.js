const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('remove-role')
    .setDescription('Remove a role to a user')
    .addUserOption(option => option.setName('user').setDescription('Mention the user you want to remove a role to').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Mention the role you want to remove').setRequired(true)),

    async execute (interaction, client) {
        const user = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        if (!user.roles.cache.has(role.id)) return await interaction.reply({ embeds: [createErrorMessage('**This user haven\'t this role!**')], ephemeral: true});

        try {
            await user.roles.remove(role);
            await interaction.reply({embeds: [createSuccessMessage('**Role Removed!**')]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}