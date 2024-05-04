const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createSuccessMessage, createCustomMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear some messages')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setMinValue(1).setMaxValue(100).setRequired(true)),

    async execute (interaction, client) {

        const amount = interaction.options.getInteger('amount');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        const newMessages = messages.filter(msg => Date.now() - msg.createdTimestamp < 1209600000);

        try {
            await interaction.channel.bulkDelete(newMessages);
            if(newMessages.size != amount) return await interaction.reply({embeds: [createCustomMessage('**Only some messages have been deleted!**\n(those older than 14 days cannot be deleted)', 'Orange')]});
            await interaction.reply({embeds: [createSuccessMessage('**Messages deleted!**')]});
        } catch (err) {
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true});
        }
    }
}