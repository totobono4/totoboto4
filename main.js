process.env.TOTOBOTENV = __dirname;
require('dotenv').config();
const config = require("./config.json");
const gitVersion = require('git-tag-version');

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const token = config[mode].token;

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { active_modules } = require('./modulesManager');
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

  const modules = require('./modulesManager').active_modules

  for (const module of modules) {
    for (command of module.commands) {
      if (interaction.commandName === command.application_command.name) {
        command.execute(interaction)
      }
    }
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
