const axios = require('axios')

async function checkTag(userID) { 
  try {
    const response = await axios.get('http://localhost:3000/brawlTag');
    return response.data[userID];
  } catch (err) {
    console.error(err);
    return 'err';
  }
}

function writeTag(key, value) {
  
  axios.post(`http://localhost:3000/brawlTag/${key}`, { value: value.toUpperCase() }).catch(err => {console.error(err)});
}

module.exports = { checkTag, writeTag };