const axios = require('axios');

async function fetchReactionRole(guild, message, emoji) {
    try {
        const response = await axios.get(`http://tambuserver.ddns.net:3000/reactionRole`, {
            headers: {
              Authorization: process.env.serverKey
            }
        });
        return response.data.find(item => item.guild == guild && item.message == message && item.emoji == emoji );
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function postReactionRole(guild, message, emoji, role) {
    axios.post(`http://tambuserver.ddns.net:3000/reactionRole`,
        { value: { "guild": guild, "message": message, "emoji": emoji, "role": role } }, 
        { headers: { Authorization: process.env.serverKey } }
    ).catch(err => {console.error(err)});
}

async function deleteReactionRole(guild, message, emoji) {
    axios.delete(`http://tambuserver.ddns.net:3000/reactionRole?guild=${guild}&message=${message}&emoji=${emoji}`,
        { headers: { Authorization: process.env.serverKey } }
    ).catch(err => {console.error(err)});
}


module.exports = { fetchReactionRole, postReactionRole, deleteReactionRole }