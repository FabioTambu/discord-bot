const {EmbedBuilder} = require('discord.js');

function createErrorMessage(message) {
    return new EmbedBuilder().setColor("Red").setDescription(message)
}

function createSuccessMessage(message) {
    return new EmbedBuilder().setColor("Green").setDescription(message)
}

function createCustomMessage(message, color) {
    return new EmbedBuilder().setColor(color).setDescription(message)
}


module.exports = {
    createErrorMessage,
    createSuccessMessage,
    createCustomMessage,

    errors: {
        permission: createErrorMessage('**You don\'t have permission!**'),
        somethingWrong: createErrorMessage('**Something went wrong**\nPlease try again'),
        sameID: createErrorMessage('**You can\'t do this to yourself!** :weary: :weary:'),
        userNotRegistered: createErrorMessage('This user is **not registered**\nTo register use the **/register** command and enter your **brawl stars tag!**'),
        brawlTagNotExist: createErrorMessage('**This brawl stars tag does not exist!**'),
        messageNotFound: createErrorMessage('**Message not found!**')
    }
}