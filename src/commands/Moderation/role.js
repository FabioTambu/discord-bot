const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Handle the role of a user')
    .addSubcommand(command => command.setName('add').setDescription('Add a role to a user')
        .addUserOption(option => option.setName('user').setDescription('Mention the user you want to add a role to').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Mention the role you want to add').setRequired(true)),
    )
    .addSubcommand(command => command.setName('remove').setDescription('Remove a role from a user')
        .addUserOption(option => option.setName('user').setDescription('Mention the user you want to remove a role from').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Mention the role you want to remove').setRequired(true)),
    ),
    

    async execute (interaction) {
        const { options, member } = interaction;
        const sub = options.getSubcommand();
        const user = options.getMember('user');
        const role = options.getRole('role');

        if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({ embeds: [errors.permission], ephemeral: true});
        
        switch (sub) {
            case 'add':
                if (user.roles.cache.has(role.id)) return await interaction.reply({ embeds: [createErrorMessage('**This user alredy have this role!**')], ephemeral: true});

                try {
                    await user.roles.add(role);
                    await interaction.reply({embeds: [createSuccessMessage('**Role Added!**')]});
                } catch (err) {
                    console.log(err)
                    return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
                }
            break;

            case 'remove':
                if (!user.roles.cache.has(role.id)) return await interaction.reply({ embeds: [createErrorMessage('**This user haven\'t this role!**')], ephemeral: true});

                try {
                    await user.roles.remove(role);
                    await interaction.reply({embeds: [createSuccessMessage('**Role Removed!**')]});
                } catch (err) {
                    console.log(err);
                    return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
                }
            break;
        }
    }
}