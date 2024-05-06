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
        { name: 'ban add or remove', description: 'Ban or unban a user' },
        { name: 'mute add or remove', description: 'Mute or unmute a user' },
        { name: 'nickname change or remove', description: 'Change or remove the nickname to a user' },
        { name: 'role add or remove', description: 'Add or remove a role to a user' },
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

