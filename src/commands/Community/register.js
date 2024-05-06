const { SlashCommandBuilder } = require('@discordjs/builders');
const { errors, createSuccessMessage, createCustomMessage } = require('../../global');
const { writeTag, checkTag } = require('../../API-Calls/handleBrawlTag');
const { findBrawlProfile } = require('../../API-Calls/checkBrawlProfile');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Associate your brawl stars tag with your discord id')
    .addStringOption(option => option.setName('tag').setDescription('Insert your brawl stars tag').setRequired(true)),

    async execute (interaction) {
        const { options, user } = interaction;
        const tag = options.getString('tag');

        const tagExist = await findBrawlProfile(tag);
            if (tagExist == '404 err') return interaction.reply({ embeds: [errors.brawlTagNotExist], ephemeral: true });
            
            const tagInDatabase = await checkTag(user.id);
            if(tagInDatabase == tag.toUpperCase()) return interaction.reply({ embeds: [createCustomMessage('**You are already registered with this tag!**', 'Orange')], ephemeral: true });
 
        try {
            writeTag(user.id, tag)
            await interaction.reply({embeds: [createSuccessMessage('**Tag Updated!**')]});
        } catch (err) {
            console.log(err);
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true})
        }
    }
}