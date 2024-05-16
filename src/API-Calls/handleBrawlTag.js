const axios = require('axios');

async function checkTag(userID) { 
  try {
    const response = await axios.get(`https://discord.tamburini.dev/brawlTag/${userID}`, {
        headers: {
          Authorization: process.env.serverKey
        }
    });
    return response.data[0].brawlTag;
  } catch (err) {
    console.error(err);
    if (err.response.status == 404) return '404 err';
    return 'err';
  }
}   

function postTag(id, tag) {
  axios.post('https://discord.tamburini.dev/brawlTag',
    { id: id, tag: tag.toUpperCase() },
    { headers: { Authorization: process.env.serverKey } }
  ).catch(err => {console.error(err)});
}

module.exports = { checkTag, postTag };