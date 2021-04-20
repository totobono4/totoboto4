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

//Variables Musique
const musicModule = require('./modules/music/music.js');
const minecraftModule = require("./modules/minecraft/minecraft.js");

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

	// Commandes du module musique.

	for (command in musicModule.commands)
	{
		if (message.content.startsWith(`${prefix}${musicModule.commands[command]}`))
		{
			musicModule.musicModule(prefix, message);
			return;
		}
	}

	for (authorID in minecraftModule.whitelist)
	{
		if (message.author.id == minecraftModule.whitelist[authorID])
		{
			for (command in minecraftModule.commands)
			{
				if (message.content.startsWith(`${prefix}${minecraftModule.commands[command]}`))
				{
					minecraftModule.minecraftModule(prefix, message);
					return;
				}
			}
		}
	}

	//Autres Commandes
	
	//Default
	message.channel.send("Entrez une commande valide!");
});

//Token
client.login(token);