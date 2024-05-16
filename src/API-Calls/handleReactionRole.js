const axios = require('axios');

async function fetchReactionRole(guild, message, emoji) {
    try {
        const response = await axios.get(`https://discord.tamburini.dev/reactionRole/${guild}`, {
            params: { "message": message, "emoji": emoji },
            headers: { Authorization: process.env.serverKey }
        });
        return response.data[0];
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function postReactionRole(guild, message, emoji, role) {
    axios.post(`https://discord.tamburini.dev/reactionRole/${guild}`,
        { "message": message, "emoji": emoji, "role": role }, 
        { headers: { Authorization: process.env.serverKey } }
    ).catch(err => {console.error(err)});
}

async function deleteReactionRole(guild, message, emoji) {
    axios.delete(`https://discord.tamburini.dev/reactionRole/${guild}`, {
        params: { "message": message, "emoji": emoji },
        headers: { Authorization: process.env.serverKey } }
    ).catch(err => {console.error(err)});
}


module.exports = { fetchReactionRole, postReactionRole, deleteReactionRole }