const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user')
    .addSubcommand(command => command.setName('add').setDescription('Add a mute to a user')
        .addIntegerOption(option => option
            .setName('duration')
            .setDescription('Decide the mute duration')
            .setRequired(true)
            .addChoices(
                {name: '5 minutes', value: 5 * 60},
                {name: '10 minutes', value: 10 * 60},
                {name: '30 minutes', value: 30 * 60},
                {name: '1 hour', value: 1 * 60 * 60},
                {name: '2 hours', value: 2 * 60 * 60},
                {name: '4 hours', value: 4 * 60 * 60},
                {name: '6 hours', value: 6 * 60 * 60},
                {name: '12 hours', value: 12 * 60 * 60},
                {name: '1 day', value: 1 * 24 * 60 * 60},
                {name: '2 days', value: 2 * 24 * 60 * 60},
                {name: '3 days', value: 3 * 24 * 60 * 60},
                {name: '5 days', value: 5 * 24 * 60 * 60},
                {name: '7 days', value: 7 * 24 * 60 * 60},
                {name: '10 days', value: 10 * 24 * 60 * 60},
                {name: '14 days', value: 14 * 24 * 60 * 60}
            )
        )
        .addUserOption(option => option.setName('user').setDescription('Mention the user you want to mute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason of the mute'))
    )
    .addSubcommand(command => command.setName('remove').setDescription('Remove a mute from a user')
        .addUserOption(option => option.setName('user').setDescription('Mention the user you want to unmute').setRequired(true))
    ),

    async execute (interaction) {
        const { options, member } = interaction;
        const sub = options.getSubcommand();
        const user = options.getMember('user');

        if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        
        switch (sub) {
            case 'add':
                const duration = options.getInteger('duration');
                const reason = options.getString('reason') || 'No reason provided';

                if (user.id == member.id) return await interaction.reply({ embeds: [errors.sameID], ephemeral: true});
                if (user.isCommunicationDisabled()) return await interaction.reply({ embeds: [createErrorMessage('**This user is alredy muted!**')], ephemeral: true });
                if (user.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({ embeds: [createErrorMessage('**I cannot mute this user!**')], ephemeral: true });
        
                user.timeout(duration * 1000, reason);
                await interaction.reply({embeds: [createSuccessMessage(`**${user.user.globalName}** has been muted for **${duration} seconds\nReason**: ${reason}`)]});
            break;
        
            case 'remove':
                if (!user.isCommunicationDisabled()) return await interaction.reply({ embeds: [createErrorMessage('**This user is not muted!**')], ephemeral: true });

                user.timeout(1);
                await interaction.reply({embeds: [createSuccessMessage(`**${user.user.globalName}** has been **unmuted!**`)]});
            break;
        }
    }
}