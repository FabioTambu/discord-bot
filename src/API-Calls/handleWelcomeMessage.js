const axios = require('axios');

async function fetchWelcomeMessage(guild) {
    try {
        const response = await axios.get(`https://discord.tamburini.dev/welcomeMessage/${guild}`, {
            headers: { Authorization: process.env.serverKey }
        });
        return response.data[0];
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function postWelcomeMessage(guild, channel, message) {
    axios.post(`https://discord.tamburini.dev/welcomeMessage/${guild}`,
        { "channel": channel, "message": message }, 
        { headers: { Authorization: process.env.serverKey } }
    ).catch(err => {console.error(err)});
}

async function deleteWelcomeMessage(guild) {
    axios.delete(`https://discord.tamburini.dev/welcomeMessage/${guild}`, {
        headers: { Authorization: process.env.serverKey } }
    ).catch(err => {console.error(err)});
}


module.exports = { fetchWelcomeMessage, postWelcomeMessage, deleteWelcomeMessage }