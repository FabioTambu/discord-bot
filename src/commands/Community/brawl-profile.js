const { SlashCommandBuilder } = require('@discordjs/builders');
const { errors, createErrorMessage } = require('../../global');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const { checkTag } = require('../../API-Calls/handleBrawlTag');
const { findBrawlProfile, fetchAllBrawlers, handleProfileIcon } = require('../../API-Calls/fetchBrawlInfo')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('brawl-profile')
        .setDescription('Get some information of a brawl stars profile')
        .addUserOption(option => option.setName('user').setDescription('Mention the user whose profile you want to see'))
        .addStringOption(option => option.setName('tag').setDescription('Enter the brawl stars tag whose profile you want to see')),

    async execute(interaction) {
        const { options } = interaction;

        try {
            // Initialization of variables
            const user = options.getUser('user');
            let tag = options.getString('tag');
            const imageBorder = 10;

            await interaction.deferReply()
            
            // Error handling
            if (!user && !tag) return await interaction.editReply({ embeds: [createErrorMessage('**You must enter at least one option!**')], ephemeral: true})
            if (user && !tag){
                tag = await checkTag(user.id);
                if (!tag) return await interaction.editReply({ embeds: [errors.userNotRegistered], ephemeral: true });
                if (tag == 'err') return await interaction.editReply({ embeds: [errors.somethingWrong], ephemeral: true });
            }

            // API calls
            const playerResponse = await findBrawlProfile(tag);
            if (playerResponse == '404 err') return interaction.editReply({ embeds: [createErrorMessage('**This brawl stars tag does not exist!**')], ephemeral: true});
            if (playerResponse == 'err') return interaction.editReply({ embeds: [errors.somethingWrong], ephemeral: true });

            const brawlersResponse = await fetchAllBrawlers();
            if(brawlersResponse == 'err') return interaction.editReply({ embeds: [errors.somethingWrong], ephemeral: true });
            
            const playerData = playerResponse.data;

            // Save the brawlers
            let allBrawlers = [];
            for (let i=0; i < brawlersResponse.data.items.length; i++) {
                const searchBrawler = playerData.brawlers.find(brawler => brawler.name === brawlersResponse.data.items[i].name);

                allBrawlers.push({name: brawlersResponse.data.items[i].name, rank: searchBrawler ? searchBrawler.rank : -1});
            }
            allBrawlers.sort((a, b) => b.rank - a.rank);

            // Create Image & Font
            const totalWidth = 1920;
            const totalHeight = 1080;
            const canvas = createCanvas(totalWidth + imageBorder * 2, totalHeight);
            const ctx = canvas.getContext('2d');
            ctx.font = 'bold 35px Sans';
            ctx.fillStyle = 'white';
            // Background
            const background = await loadImage('assets/background.jpg');
            ctx.drawImage(background, 0, 0, totalWidth + imageBorder * 2, totalHeight);
            // Add Profile Icon
            const profileIcon = await handleProfileIcon(28000254)
            ctx.drawImage(profileIcon, 45 + imageBorder, 25, 150, 150)
            // Player Names
            const playerNameX = 400 - ctx.measureText(playerData.name).width / 2 + imageBorder;
            ctx.fillText(playerData.name, playerNameX, 75);

            // Save Headers Values
            const headers = ['totalTrophy', 'trophy', '3v3', 'soloShowdown', 'duoShowdown', 'starPower', 'gadget', 'gear', 'lock'];
            const headersValues = {
                totalTrophy: playerData.highestTrophies,
                trophy: playerData.trophies,
                '3v3': playerData['3vs3Victories'],
                soloShowdown: playerData.soloVictories,
                duoShowdown: playerData.duoVictories,
                starPower: 0,
                gadget: 0,
                gear: 0,
                lock: `${playerData.brawlers.length}/${allBrawlers.length}`
            }
            for (let i=0; i<playerData.brawlers.length; i++) {
                headersValues.starPower = headersValues.starPower + playerData.brawlers[i].starPowers.length;
                headersValues.gadget = headersValues.gadget + playerData.brawlers[i].gadgets.length;
                headersValues.gear = headersValues.gear + playerData.brawlers[i].gears.length;
            }
            headersValues.starPower = `${headersValues.starPower}/${allBrawlers.length*2}`;
            headersValues.gadget = `${headersValues.gadget}/${allBrawlers.length*2}`;

            // Create Headers Photo
            for (let i=0; i<headers.length; i++) {
                // Create Header Background
                const headerBackground = await loadImage('assets/headerBackground.png');
                const { headerX, headerY } = calculateHeaderBackgroundPosition(i+1, imageBorder);
                ctx.drawImage(headerBackground, headerX, headerY, 240, 60);
                // Create Header Icon
                const headerIcon = await loadImage(`assets/icons/${headers[i]}.png`);
                ctx.drawImage(headerIcon, headerX - 30, headerY, 70, 70);
                // Create Header Text
                const HeaderTextX = headerX + 120 - ctx.measureText(headersValues[headers[i]]).width / 2;
                ctx.fillText(headersValues[headers[i]], HeaderTextX, headerY + 42);
            }
            
            // Create Brawlers Photo
            for (let i = 0; i < allBrawlers.length; i++) {
                // Calculate Brawler Photo Coordinates
                const { brawlerX, brawlerY } = calculateBrawlerPosition(i, totalWidth, imageBorder)

                if(allBrawlers[i].rank !== -1) {
                    // Search Brawler
                    const brawler = playerData.brawlers.find(brawler => brawler.name === allBrawlers[i].name);
                    // Calculate Brawler Rank Background Color
                    const backgroundRank = Math.floor(brawler.rank / 5) * 5;
                    // Crate Brawler Backkground Photo
                    const backgroundBrawler = await loadImage(`assets/brawler-background/rank-${backgroundRank}.png`);
                    ctx.drawImage(backgroundBrawler, brawlerX, brawlerY, 192, 107);
                    // Create Brawler Portrait Photo
                    const portraitBrawler = await loadImage(`assets/portrait/color/${formatBrawlerName(brawler.name)}.png`);
                    ctx.drawImage(portraitBrawler, brawlerX + 3, brawlerY + 3, 186, 101);
                    // Create Brawler Rank Photo
                    const rankBrawler = await loadImage(`assets/rank/rank${brawler.rank}.png`);
                    ctx.drawImage(rankBrawler, brawlerX + 110, brawlerY + 16, 65.87, 75);

                    /*
                        RANK + MASTERY

                        const mastery = await loadImage(`assets/mastery/8bit2.png`).catch(() => null);

                        // Disegna il rango
                        ctx.drawImage(rank, x + 105, y + 8, 57, 65);

                        // Disegna la mastery
                        if (mastery) ctx.drawImage(mastery, x + 151, y + 62, 40, 40);
                    */

                } else {
                    // Create Locked Brawler Photo
                    let backgroundBrawler = await loadImage(`assets/portrait/black-and-white/${formatBrawlerName(allBrawlers[i].name)}.png`);
                    ctx.drawImage(backgroundBrawler, brawlerX, brawlerY, 192, 107);
                }

            }
            await interaction.editReply({ files: [{ attachment: canvas.toBuffer(), name: `${tag}-profile.png` }] });
            
        } catch (err) {
            console.log(err);
            await interaction.editReply({ embeds: [errors.somethingWrong], ephemeral: true});
        }
    }
};

function calculateBrawlerPosition(index, width, border) {
    const brawlerX = (index % 10) * 192 + border;
    const brawlerY = Math.floor((index * 192) / width) * 107 + 200;
    return { brawlerX, brawlerY }
}

function calculateHeaderBackgroundPosition(i, border) {
    const column = Math.floor(i / 2);
    const row = i % 2;
    const headerX = column * 320 + 290 + border;
    const headerY = row * 80 + 30;
    return { headerX, headerY };
}

function formatBrawlerName(brawlerName) {
    return brawlerName.toLowerCase().replace(/ /g, '');
}

