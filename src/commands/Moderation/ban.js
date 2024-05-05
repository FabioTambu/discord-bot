const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createSuccessMessage, createErrorMessage } = require('../../global');



module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Handle the ban of a user')
    .addSubcommand(command => command.setName('add').setDescription('Add a ban to a user')
        .addIntegerOption(option => option
            .setName('delete-messages')
            .setDescription('Decide how many messages to delete of the user who will be banned')
            .setRequired(true)
            .addChoices(
                {name: 'Nothing', value: 0},
                {name: '1 hour', value: 1 * 60 * 60},
                {name: '2 hours', value: 2 * 60 * 60},
                {name: '3 hours', value: 3 * 60 * 60},
                {name: '6 hours', value: 6 * 60 * 60},
                {name: '12 hours', value: 12 * 60 * 60},
                {name: '1 day', value: 1 * 24 * 60 * 60},
                {name: '2 days', value: 2 * 24 * 60 * 60},
                {name: '3 days', value: 3 * 24 * 60 * 60},
                {name: '7 days', value: 7 * 24 * 60 * 60},
                {name: '14 days', value: 14 * 24 * 60 * 60}
            )
        )
        .addUserOption(option => option.setName('user').setDescription('Mention the user you want to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter the reason for the ban'))
    )
    .addSubcommand(command => command.setName('remove').setDescription('Remove the ban of a user')
        .addStringOption(option => option.setName('user-id').setDescription('Insert the user id you want to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter the reason for the unban')),
    ),

    async execute (interaction) {
        const { options, member, guild } = interaction;
        const sub = options.getSubcommand();
        const reason = options.getString('reason') || 'No reason provided';

        if (!member.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        
        switch (sub) {
            case 'add':
                const user = options.getMember('user');    
                const deleteMessages = options.getInteger('delete-messages');

                if (user.id == member.id) return await interaction.reply({ embeds: [errors.sameID], ephemeral: true});

                try {
                    user.ban({deleteMessageSeconds: deleteMessages, reason: reason});
                    await interaction.reply({embeds: [createSuccessMessage(`**${user.user.globalName}** has been **banned\nReason**: ${reason}`)]});
                } catch (err) {
                    console.log(err);
                    return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
                }
            break;

            case 'remove':
                    const userId = options.getString('user-id');

                    const isUserBanned = await guild.bans.fetch(userId).catch(() => null);
                    if (!isUserBanned) return interaction.reply({ embeds: [createErrorMessage('**This user is not banned!**')], ephemeral: true});

                try {
                    await guild.bans.remove(userId, reason);
                    await interaction.reply({ embeds: [createSuccessMessage(`**${userId}** has been successfully **unbanned\nReason**: ${reason}`)]});
                } catch (err) {
                    console.log(err);
                    return interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true});
                }
        }
        
        
    }
}