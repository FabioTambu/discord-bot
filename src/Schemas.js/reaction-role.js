const { model, Schema } = require('mongoose');

const reactionRoleSchema = new Schema({
    Guild: String,
    Message: String,
    Emoji: String,
    Role: String
});

module.exports = model('rrs', reactionRoleSchema);

