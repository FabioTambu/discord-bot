const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkTag } = require('../../API-Calls/handleBrawlTag');
const { errors, createSuccessMessage } = require('../../global');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('check-tag')
    .setDescription('Check a user\'s brawl stars tag')
    .addUserOption(option => option.setName('user').setDescription('Mention the user whose brawl stars tag you want to see').setRequired(true)),

    async execute (interaction) {
        const { options } = interaction;
        const user = options.getUser('user');

        try {
            const tag = await checkTag(user.id);
            console.log(tag)
            if (tag == '404 err')
                await interaction.reply({embeds: [errors.userNotRegistered], ephemeral: true});
            else if (tag == 'err')
                await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
            else
                await interaction.reply({embeds: [createSuccessMessage(`This user is **registered**\nThe tag is: **${tag}**`)]}); 
            
        } catch (err) {
            console.log(err);
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}