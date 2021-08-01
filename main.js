/*\brief	Bot Discord totoboto4
 *\file		main.js
 *\author	totobono4
 *\version	1.0
 *\date		17/03/2021
**/
require('dotenv').config();
const config = require("./config.json");
const gitVersion = require('git-tag-version');

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const launch = config.launch[mode];
const { prefix, token } = launch;
const moduleConf = require("./config.json").modules;

const Discord = require("discord.js");
const client = new Discord.Client();
exports.client = client;

const modules = []
moduleConf.forEach(element => modules.push({ name : element.name, module : require(element.path) }));
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
client.on("ready", () => {
  console.log(`Bot: Hosting ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`${prefix}help | *•.¸♡ 𝐋𝐎𝐋𝐈 𝐑𝐆𝐁 𝐒𝐐𝐔𝐀𝐃 ♡¸.•*`);
});
client.on("message", async message => {	
  author = message.author;
  if (author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const completeCommand = message.content.split(' ').shift().toLowerCase();
  const args = message.content.replace(prefix, '').split(' ');
  args[0] = args[0].toLowerCase();

  for (const Module of modules) {
    const module = Module.module;
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

    for (const Module of modules) {
      const module = Module.module;

      if (module.commands !== undefined || (message.channel.nsfw && module.commandsNSFW !== undefined)) {
        help += `\n**${Module.name}** :`;

        if (module.commands !== undefined)
          help += '\n__Commands__ : [ ' + module.commands.join(' - ') + ' ]\n';

        if (message.channel.nsfw && module.commandsNSFW !== undefined)
          help += '\n__NSFW Commands__ : [ ' + module.commandsNSFW.join(' - ') + ' ]\n';
      }
    }

    message.channel.send(
      mainMessage('help', `https://www.patreon.com/bePatron?u=28615868`, help, 'totoboto4 services')
    );
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

const moduleNames = [];
modules.forEach(element => moduleNames.push(element.name));
console.log(`release : ${gitVersion()}`);
console.log(`mode : [ ${mode} ]`);
console.log(`prefix : [ ${prefix} ]`);
//console.log(`token:[${token}]`);
console.log(`loaded-modules : [ ${moduleNames.join(' - ')} ]`);
