const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands'),

    async execute(interaction) {
    const commandList = [
        { title: 'Community'},
        { name: 'register', description: 'Associate a brawl stars tag with a discord user' },
        { name: 'check-tag', description: 'Check the brawl stars tag associated with a user' },
        { name: 'brawl-profile', description: 'Shows a user\'s Brawl Stars profile' },
        { name: 'help', description: 'Shows all available commands' },
        { title: 'Administrator'},
        { name: 'ban add or remove', description: 'Ban or unban a user' },
        { name: 'mute add or remove', description: 'Mute or unmute a user' },
        { name: 'nickname change or remove', description: 'Change or remove the nickname to a user' },
        { name: 'role add or remove', description: 'Add or remove a role to a user' },
        { name: 'kick', description: 'Kick a user' },
        { name: 'clear', description: 'Clear the chat' }
    ];

    let messageContent = '';

    for (let i=0; i<commandList.length; i++) {
        if (commandList[i].title)
            messageContent += `\n***${commandList[i].title}***`
        else 
            messageContent += `**/${commandList[i].name}** - ${commandList[i].description}`
        messageContent += '\n';
    }

    const embedMessage = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("List of Available Commands")
        .setDescription(messageContent);

    await interaction.reply({ embeds: [embedMessage], ephemeral: true });
    }
}

