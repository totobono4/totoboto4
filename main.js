/*\brief	Bot Discord totoboto4
 *\file		main.js
 *\author	totobono4
 *\version	1.0
 *\date		17/03/2021
**/

const config = require("./config.json");

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const launch = config.launch[mode];
const { prefix, token } = launch;
const moduleConf = require("./config.json").modules;

const Discord = require("discord.js");
const client = new Discord.Client();
exports.client = client;

const modules = []
moduleConf.forEach(element => modules.push(require(element.path)));

client.once("ready", () => {
	console.log("Ready!");
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnect!");
});

client.on("message", async message => {	
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	for (const module of modules)
	{
		for (const command of module.commands)
		{
			if (message.content.startsWith(`${prefix}${command}`))
			{
				module.process(prefix, message);
				return;
			}
		}
	}	
	//Autres Commandes
	
	//Default
	message.channel.send("Entrez une commande valide!");
});

//Token
client.login(token);

const moduleNames = [];
moduleConf.forEach(element => moduleNames.push(element.name));
console.log(`mode : [ ${mode} ]`);
console.log(`prefix : [ ${prefix} ]`);
//console.log(`token:[${token}]`);
console.log(`loaded-modules : [ ${moduleNames.join(' - ')} ]`);