const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Handle the nickname of a user')
    .addSubcommand(command => command.setName('change').setDescription('Change the nickname of a user')
        .addUserOption(option => option.setName('user').setDescription('Mention the user whose nickname you want to change').setRequired(true))
        .addStringOption(option => option.setName('nickname').setDescription('Insert the new nickname').setRequired(true))
    )
    .addSubcommand(command => command.setName('remove').setDescription('Remove the nickname of a user')
        .addUserOption(option => option.setName('user').setDescription('Mention the user whose nickname you want to remove').setRequired(true))
    ),

    async execute (interaction) {
        const { options, member } = interaction;
        const sub = options.getSubcommand();
        const user = options.getMember('user');
        const nickname = options.getString('nickname');

        if (!member.permissions.has(PermissionFlagsBits.ManageNicknames)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        
        switch (sub) {
            case 'change':
                if (user.nickname === nickname) return await interaction.reply({ embeds: [createErrorMessage('**This user have alredy this nickname!**')], ephemeral: true});

                try {
                    await user.setNickname(nickname);
                    await interaction.reply({embeds: [createSuccessMessage('**Nickname Changed!**')]});
                } catch (err) {
                    console.log(err)
                    return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
                }
            break;

            case 'remove':
                if (!user.nickname) return await interaction.reply({ embeds: [createErrorMessage('**This user haven\'t a nickname!**')], ephemeral: true});

                try {
                    await user.setNickname(null);
                    await interaction.reply({embeds: [createSuccessMessage('**Nickname Removed!**')]});
                } catch (err) {
                    console.log(err)
                    return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
                }
            break;
        }
    }
}