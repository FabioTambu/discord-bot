const { SlashCommandBuilder } = require('@discordjs/builders');
const translate = require('@iamtraction/google-translate');
const { errors, createSuccessMessage } = require('../../global');

const languages = [
    {name: 'English', value: 'en'},
    {name: 'Español (Spanish)', value: 'es'},
    {name: 'हिन्दी (Hindi)', value: 'hi'},
    {name: 'Français (French)', value: 'fr'},
    {name: 'العربية (Arabic)', value: 'ar'},
    {name: 'Português (Portuguese)', value: 'pt'},
    {name: 'Bengali', value: 'bn'},
    {name: 'Русский (Russian)', value: 'ru'},
    {name: 'Deutsch (German)', value: 'de'},
    {name: 'ਪੰਜਾਬੀ (Punjabi)', value: 'pa'},
    {name: '日本語 (Japanese)', value: 'ja'},
    {name: 'Italiano (Italian)', value: 'it'},
    {name: '한국어 (Korean)', value: 'ko'},
    {name: 'Polski (Polish)', value: 'pl'},
    {name: 'Türkçe (Turkish)', value: 'tr'},
    {name: 'Español (Spanish)', value: 'es'},
    {name: 'فارسی (Persian)', value: 'fa'},
    {name: 'Українська (Ukrainian)', value: 'uk'},
    {name: 'اردو (Urdu)', value: 'ur'},
    {name: 'Azərbaycan dili (Azerbaijani)', value: 'az'},
    {name: 'Filipino (Filipino)', value: 'tl'},
    {name: 'Nederlands (Dutch)', value: 'nl'},
    {name: 'Indonesia (Indonesian)', value: 'id'},
    {name: 'اردو (Urdu)', value: 'ur'},
    { name: 'Filipino (Filipino)', value: 'tl' }
];


module.exports = {
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a message or a text')
    .addSubcommand(command => command.setName('message').setDescription('Translate a message')
        .addStringOption(option => option.setName('message-id').setDescription('Enter the ID of the message you want to translate').setRequired(true))
        .addStringOption(option => option.setName('language').setDescription('Enter the language into which I need to translate the message').setRequired(true).setChoices(...languages))
    )
    .addSubcommand(command => command.setName('text').setDescription('Translate a text')
        .addStringOption(option => option.setName('text').setDescription('Enter the text you want to translate').setRequired(true))
        .addStringOption(option => option.setName('language').setDescription('Enter the language into which I need to translate the message').setRequired(true).setChoices(...languages))
        .addBooleanOption(option => option.setName('show').setDescription('Show the text you translated to everyone on the channel'))
    ),

    async execute (interaction) {
        const { options, channel } = interaction;
        const sub = options.getSubcommand();
        const language = options.getString('language');
        const show = options.getBoolean('show') || false;
        let text;
        let textTranslated;

        try {
            switch (sub) {
                case 'message':
                    const messageID = options.getString('message-id')
                    try {
                        text = await channel.messages.fetch(messageID).then(message => message.content)
                    } catch {
                        return await interaction.reply({ embeds: [errors.messageNotFound], ephemeral: true })
                    }

                    textTranslated = await translate(text, { to: `${language}` })
                    interaction.reply({ embeds: [createSuccessMessage(textTranslated.text)], ephemeral: true})
                break;

                case 'text':
                    text = options.getString('text')
                    textTranslated = await translate(text, { to: `${language}` })
                    interaction.reply({ embeds: [createSuccessMessage(textTranslated.text)], ephemeral: !show})
                break;
            }
        } catch (err) {
            console.log(err);
            return await interaction.reply({ embeds: [errors.somethingWrong], ephemeral: true })
        }
        
    }
    
}