process.env.TOTOBOTENV = __dirname;
require('dotenv').config();
const config = require("./config.json");
const gitVersion = require('git-tag-version');

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const token = config[mode].token;

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    const user = interaction.user;
    const url = 'https://tenor.com/view/pong-video-game-atari-tennis-70s-gif-16894549';
    const gif = 'https://c.tenor.com/2gyJVMt_L6wAAAAC/pong-video-game.gif';
    await interaction.reply({
      embeds: [
        mainMessage(user, gif, 'ping', url, 'pong !', gif, 'totoboto4 ping services')
      ]
    });
  }
});

function mainMessage(author, thumbnail, title, url, description, image, footer)
{
  return new EmbedBuilder()
    .setColor('Navy')
    .setAuthor({
      name: author.username
    })
    .setThumbnail(thumbnail)
    .setTitle(title)
    .setURL(url)
    .setDescription(description)
    .setImage(image)
    .setFooter({
      text: footer
    })
    .setTimestamp(new Date());
}

//Token
client.login(process.env[token]);

console.log(`release : ${gitVersion()}`);
console.log(`mode : [ ${mode} ]`);
