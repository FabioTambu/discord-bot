const axios = require('axios')

async function checkTag(userID) { 
  try {
    const response = await axios.get('http://192.168.1.51:3000/brawlTag', {
        headers: {
          Authorization: process.env.serverKey
        }
    });
    return response.data[userID];
  } catch (err) {
    console.error(err);
    return 'err';
  }
}

function writeTag(key, value) {
  axios.post(`http://192.168.1.51:3000/brawlTag/${key}`, {
    value: value.toUpperCase(),
    headers: {
      Authorization: process.env.serverKey
    }
  }).catch(err => {console.error(err)});
}

module.exports = { checkTag, writeTag };