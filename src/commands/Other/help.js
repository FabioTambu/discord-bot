const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),

    async execute(interaction) {
    const commandList = [
        { name: 'register', description: 'Associate a brawl stars tag with a discord user' },
        { name: 'check-tag', description: 'Check the brawl stars tag associated with a user' },
        { name: 'brawl-profile', description: 'Shows a user\'s Brawl Stars profile' },
        { name: 'ban', description: 'Ban a user' },
        { name: 'unban', description: 'Unban a user' },
        { name: 'mute', description: 'Mute a user' },
        { name: 'umute', description: 'Unmute a user' },
        { name: 'nickname', description: 'Change the nickname to a user' },
        { name: 'remove-nickname', description: 'Remove the nickname to a user' },
        { name: 'role-add', description: 'Add a role to a user' },
        { name: 'role-remove', description: 'Remove a role to a user' },
        { name: 'kick', description: 'Kick a user' },
        { name: 'clear', description: 'Clear the chat' },
        { name: 'help', description: 'Shows all available commands' },
    ];

    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("List of Available Commands")
        .setDescription(commandList.map(cmd => `**/${cmd.name}** - ${cmd.description}`).join('\n'));

    await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}

