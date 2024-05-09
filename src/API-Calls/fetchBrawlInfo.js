const axios = require('axios');
const { loadImage } = require('canvas');
const fs = require('fs').promises;

async function findBrawlProfile(tag) {
    try {
        const response = await axios.get(`https://bsproxy.royaleapi.dev/v1/players/%23${tag}`, {
            headers: {
                'Authorization': process.env.brawlAPIAuthorization,
            }
        })
        return response;
    } catch (err) {
        if (err.response.status == 404) return '404 err'
        console.log(err);
        return 'err';
    }
}

async function fetchAllBrawlers() {
    try {
        const response = axios.get('https://bsproxy.royaleapi.dev/v1/brawlers', {
            headers: {
                'Authorization': process.env.brawlAPIAuthorization,
            }
        });
        return response;
    } catch (err) {
        console.log(err);
        return 'err';
    }
}

async function handleProfileIcon(iconId) {
    try {
        return await loadImage(`assets/icons/profile/${iconId}.png`);
    } catch {
        const response = await axios.get(`https://cdn-old.brawlify.com/profile/${iconId}.png`, { responseType: 'arraybuffer' }).catch(() => null);
        if (response && response.status === 200) {
            const imageBuffer = Buffer.from(response.data, 'binary');
            const image = await loadImage(imageBuffer);
            
            fs.writeFile(`assets/icons/profile/${iconId}.png`, imageBuffer);
            
            return image;
        } else {
            return await loadImage(`assets/icons/profile/28000000.png`);
        }
    }
}

module.exports = { findBrawlProfile, fetchAllBrawlers, handleProfileIcon };