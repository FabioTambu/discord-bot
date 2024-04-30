const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Change the nickname to a user')
    .addUserOption(option => option.setName('user').setDescription('Mention the user whose nickname you want to change').setRequired(true))
    .addStringOption(option => option.setName('nickname').setDescription('Insert the new nickname').setRequired(true)),

    async execute (interaction, client) {
        const user = interaction.options.getMember('user');
        const nickname = interaction.options.getString('nickname');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        if (user.nickname === nickname) return await interaction.reply({ embeds: [createErrorMessage('**This user have alredy this nickname!**')], ephemeral: true});

        try {
            await user.setNickname(nickname);
            await interaction.reply({embeds: [createSuccessMessage('**Nickname Changed!**')]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}