const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const reaction = require('../../Schemas.js/reaction-role');
const { errors, createErrorMessage, createSuccessMessage } = require('../../global');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction-roles')
        .setDescription('Set a role to a user when they react to a specific message')
        .addSubcommand(command => command.setName('add').setDescription('Add a reaction role to a message')
            .addStringOption(option => option.setName('message-id').setDescription('Enter the ID of the message to which users will add the reaction').setRequired(true))
            .addStringOption(option => option.setName('emoji').setDescription('Enter the emoji to use').setRequired(true))
            .addRoleOption(option => option.setName('role').setDescription('Mention the role you want to assign with the reaction').setRequired(true))
        )
        .addSubcommand(command => command.setName('remove').setDescription('Remove a reaction role from a message')
            .addStringOption(option => option.setName('message-id').setDescription('Enter the ID of the message to which users will add the reaction').setRequired(true))
            .addStringOption(option => option.setName('emoji').setDescription('Enter the emoji to use').setRequired(true))
        ),

    async execute(interaction) {
        const { options, guild, channel } = interaction;
        const sub = options.getSubcommand();
        const emoji = options.getString('emoji');
        const messageId = options.getString('message-id');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles && PermissionFlagsBits.ManageMessages)) return interaction.reply({ embeds: [errors.permission], ephemeral: true})
        const message = await channel.messages.fetch(messageId).catch(() => {
            interaction.reply({ embeds: [createErrorMessage('**Message not found!**')], ephemeral: true})
        });

        const data = await reaction.findOne({ Guild: guild.id, Message: message.id, Emoji: emoji});
        
        switch (sub) {
            case 'add':
                if (data) return interaction.reply({ embeds: [createErrorMessage(`**Reaction role with ${emoji} emoji already exists for this message!**`)], ephemeral: true})

                const role = options.getRole('role');
                await reaction.create({
                    Guild: guild.id,
                    Message: message.id,
                    Emoji: emoji,
                    Role: role.id
                })

                await message.react(emoji);

                await interaction.reply({ embeds: [createSuccessMessage(`**I have added a reaction role to ${message.url} with the ${emoji} emoji and the role ${role}**`)]});
                break;

            case "remove":
                if (!data) return interaction.reply({ embeds: [createErrorMessage(`**The react role with ${emoji} emoji does not exist for this message!**`)], ephemeral: true})
                await reaction.deleteMany({
                    Guild: guild.id,
                    Message: message.id,
                    Emoji: emoji
                })

                await message.reactions.cache.get(emoji).remove();

                await interaction.reply({ embeds: [createSuccessMessage(`**I have removed the reaction role from ${message.url} with the ${emoji} emoji**`)]});
                break;
        }
    }
}