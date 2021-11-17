/*\brief	Bot Discord totoboto4
 *\file		main.js
 *\author	totobono4
 *\version	1.0
 *\date		17/03/2021
**/

process.env.TOTOBOTENV = __dirname;
require('dotenv').config();
const config = require("./config.json");
const gitVersion = require('git-tag-version');

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const launch = config.launch[mode];
const { prefix, token } = launch;
const moduleConf = [];
const modulesFolder = './node_modules/@totoboto4-module/';

const fs = require('fs');
if (fs.existsSync('./node_modules/@totoboto4-module/')) {
  fs.readdirSync(modulesFolder).forEach(file => {
    moduleConf.push(`@totoboto4-module/${file}`);
  });
}
else console.log("No module installed /!\\");

if (mode === 'SDK') moduleConf.push(`${process.cwd()}/module.js`);

const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
exports.client = client;

const modules = []
moduleConf.forEach(element => modules.push(require(element)));

let author;

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("messageCreate", async message => {	
  author = message.author;
  if (author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const completeCommand = message.content.split(' ').shift().toLowerCase();
  const args = message.content.replace(prefix, '').split(' ');
  args[0] = args[0].toLowerCase();

  for (const module of modules) {
    let commands = [];

    if (module.commands !== undefined)
      commands = commands.concat(module.commands);

    if (message.channel.nsfw && module.commandsNSFW !== undefined)
      commands = commands.concat(module.commandsNSFW);

    for (const command of commands){
      if (completeCommand === `${prefix}${command}`){
        module.process(message, args);
        return;
      }
    }
  }

  //Autres Commandes
  if (args[0] === 'help') 
  {
    let help = '';

    for (const module of modules) {
      if (module.commands !== undefined || (message.channel.nsfw && module.commandsNSFW !== undefined)) {
        help += `\n**${module.name}** :`;

        if (module.commands !== undefined)
          help += '\n__Commands__ : [ ' + module.commands.join(' - ') + ' ]\n';

        if (message.channel.nsfw && module.commandsNSFW !== undefined)
          help += '\n__NSFW Commands__ : [ ' + module.commandsNSFW.join(' - ') + ' ]\n';
      }
    }

    message.channel.send({
      embeds: [ mainMessage('--> __Buy me a coffee__ <--', `https://www.patreon.com/bePatron?u=28615868`, help, 'totoboto4 services') ]
    });
    return;
  }

  //Default
  message.channel.send("Entrez une commande valide!");
});

function mainMessage(titleCommand, url, message_description, footer)
{
  return new Discord.MessageEmbed()
    .setTitle(titleCommand)
    .setURL(url)
    .setImage(url)
    .setAuthor(
      author.username,
      client.user.avatarURL
    )
    .setDescription(message_description)
    .setTimestamp(new Date())
    .setFooter(
      footer,
      client.user.avatarURL
    );
}

//Token
client.login(process.env[token]);

const moduleDescriptions = [];
modules.forEach(element => moduleDescriptions.push(`${element.name} V.${element.version}`));
console.log(`release : ${gitVersion()}`);
console.log(`mode : [ ${mode} ]`);
console.log(`prefix : [ ${prefix} ]`);
if (mode === 'SDK') console.log(`module : [ ${moduleDescriptions.join('\n  ')} ]`)
else console.log(`loaded-modules : [\n  ${moduleDescriptions.join('\n  ')}\n]`);