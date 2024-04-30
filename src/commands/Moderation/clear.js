const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear some messages')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setMinValue(1).setMaxValue(100).setRequired(true)),

    async execute (interaction, client) {

        const amount = interaction.options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});

        try {
            await interaction.channel.bulkDelete(amount)
            await interaction.reply({embeds: [createSuccessMessage('**Messages deleted!**')]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}