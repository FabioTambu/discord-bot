const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createSuccessMessage, createErrorMessage } = require('../../global');
const { fetchWelcomeMessage, postWelcomeMessage, deleteWelcomeMessage } = require('../../API-Calls/handleWelcomeMessage');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Handle server welcome messages')
    .addSubcommand(command => command.setName('enable').setDescription('Enable server welcome messages')
        .addChannelOption(option => option.setName('channel').setDescription('Tag the channel in which the welcome messages will be sent').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Customize the message to send (You can tag the user by writing @user)'))
    )
    .addSubcommand(command => command.setName('change').setDescription('Enable server welcome messages')
        .addChannelOption(option => option.setName('channel').setDescription('Tag the new channel in which the welcome messages will be sent').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Customize the message to send (You can tag the user by writing @user)').setRequired(true))
    )
    .addSubcommand(command => command.setName('disable').setDescription('Disable server welcome messages'))
    .addSubcommand(command => command.setName('check').setDescription('Check if server welcome messages are enable')),

    async execute (interaction) {
        const { options, guild, member } = interaction;
        const sub = options.getSubcommand();
        const channel = options.getChannel('channel');

        if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
    
        try {
            switch (sub) {
                case 'change':
                case 'enable':
                    const message = options.getString('message') || "I need a dollar";
                    postWelcomeMessage(guild.id, channel.id, message);
                    await interaction.reply({ embeds: [createSuccessMessage('Welcome message system **enabled!**')]});
                break;

                case 'disable':
                    deleteWelcomeMessage(guild.id);
                    await interaction.reply({ embeds: [createSuccessMessage('Welcome message system **disabled!**')]});
                break;

                case 'check':
                    const response = await fetchWelcomeMessage(guild.id);
                    if (!response)
                        await interaction.reply({ embeds: [createErrorMessage('Welcome message system isn\'t enable')]});
                    else
                        await interaction.reply({ embeds: [createSuccessMessage(`Welcome message system is enable\nMessage: ${response.message}`)]});
                break;
            }
        } catch (err) {
            console.log(err);
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true })
        }
        
    }
    
}