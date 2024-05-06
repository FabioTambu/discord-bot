const axios = require('axios');

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

module.exports = { findBrawlProfile, fetchAllBrawlers };