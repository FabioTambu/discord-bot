const { Client, GatewayIntentBits, Collection, Events } = require(`discord.js`);
const fs = require('fs');
const { errors } = require('./global');
const { fetchWelcomeMessage, deleteWelcomeMessage } = require('../src/API-Calls/handleWelcomeMessage');
const { fetchReactionRole } = require('./API-Calls/handleReactionRole')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers
  ]
}); 
client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

client.on(Events.MessageReactionAdd, async (reaction, user) => {

  if (!reaction.message.guildId) return;
  if (user.bot) return;

  let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
  if (!reaction.emoji.id) cID = reaction.emoji.name;

  const data = await fetchReactionRole(reaction.message.guildId, reaction.message.id, cID);
  if (!data) return;

  const guild = await client.guilds.cache.get(reaction.message.guildId);
  const member = await guild.members.cache.get(user.id);

  try {
    await member.roles.add(data["role"]);
  } catch (err) {
    console.log(err);
    return await reaction.message.reply({ embeds: [errors.somethingWrong], ephemeral: true});
  }
})

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (!reaction.message.guildId) return;
  if (user.bot) return;

  let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
  if (!reaction.emoji.id) cID = reaction.emoji.name;

  const data = await fetchReactionRole(reaction.message.guildId, reaction.message.id, cID);
  if (!data) return;

  const guild = await client.guilds.cache.get(reaction.message.guildId);
  const member = await guild.members.cache.get(user.id);

  try {
    await member.roles.remove(data["role"]);
  } catch (err) {
    console.log(err);
    return await reaction.message.reply({ embeds: [errors.somethingWrong], ephemeral: true});
  }
})

client.on(Events.GuildMemberAdd, async (member) => {
  const response = await fetchWelcomeMessage(member.guild.id);

  if (response) {
    const message = response.message.replace(/@user/g, `<@${member.user.id}>`);
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === response.channel);
    if (welcomeChannel)
      welcomeChannel.send(message)
    else
      deleteWelcomeMessage(member.guild.id)
  }
});
