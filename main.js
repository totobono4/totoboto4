/*\brief	Bot Discord totoboto4
 *\file		main.js
 *\author	totobono4
 *\version	1.0
 *\date		17/03/2021
**/

const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
exports.client = client;

const modules = [
	require('./modules/music/music.js'),
	require('./modules/danbooru/danbooru.js')
]

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