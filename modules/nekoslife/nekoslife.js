const Discord = require('discord.js');
const https = require('https');

const { client } = require("../../main.js");

const nekoclient = require('nekos.life');
const neko = new nekoclient();

let author;

const sfwCommands = neko.sfw;
const sfwKeys = Object.keys(sfwCommands);
const sfwFuncs = Object.values(sfwCommands);
const sfwNewCommands = {};
sfwKeys.forEach((key, i) => sfwNewCommands[key.toLowerCase()] = sfwFuncs[i]);
const sfwNewKeys = Object.keys(sfwNewCommands);

const nsfwCommands = neko.nsfw;
const nsfwKeys = Object.keys(nsfwCommands);
const nsfwFuncs = Object.values(nsfwCommands);
const nsfwNewCommands = {};
nsfwKeys.forEach((key, i) => nsfwNewCommands[key.toLowerCase()] = nsfwFuncs[i]);
const nsfwNewKeys = Object.keys(nsfwNewCommands);

exports.commands = ['nekohelp'].concat(sfwNewKeys).concat(nsfwNewKeys);

exports.process = async (prefix, args, message) => {

    author = message.author;
    const nekommand = args[0];

    if (message.content.startsWith(`${prefix}nekohelp`)) {
		help(message);
		return;
	}

    if (message.content.startsWith(`${prefix}owoify`))
    {
        OwOify(message, message.content.split(`${prefix}owoify `).pop());
        return;
    }

    if (message.content.startsWith(`${prefix}`) && sfwNewKeys.includes(nekommand)) {
		sfw(message, nekommand);
		return;
	}

    if (!message.channel.nsfw && nsfwKeys.includes(nekommand))
    {
        message.channel.send('Vous ne pouvez pas utiliser cette commande dans ce salon :/');
        return;
    }

    if (message.content.startsWith(`${prefix}`) && nsfwNewKeys.includes(nekommand)) {
		nsfw(message, nekommand);
		return;
	}
}

async function OwOify(message, phrase) {
    let owo = await (await neko.sfw.OwOify({text: phrase}));

    message.channel.send("" + owo.owo);
}

async function sfw(message, nekommand) {
    const url = await (await sfwNewCommands[nekommand]()).url

    const mentionnedUsers = message.mentions.users;

    if (mentionnedUsers.size > 0) message.channel.send(nekosMessage('neko', url, `**${author.username}**.${nekommand}(**${mentionnedUsers.first().username}**);`));
    else message.channel.send(nekosMessage('neko', url, ''));
}

async function nsfw(message, nekommand) {
    const url = await (await nsfwNewCommands[nekommand]()).url

    const mentionnedUsers = message.mentions.users;

    if (mentionnedUsers.size > 0) message.channel.send(nekosMessage('neko', url, `**${author.username}**.${nekommand}(**${mentionnedUsers.first().username}**);`));
    else message.channel.send(nekosMessage('neko', url, ''));
}

async function help(message) {
    let help = 'commands :\n[ ' + sfwKeys.join(' - ') + ' ]';
    if (message.channel.nsfw) help += '\n\nnsfw commands :\n[ ' + nsfwKeys.join(' - ') + ' ]';

    message.channel.send(
        nekosMessage('neko help', null, help)
    );
}

function nekosMessage(titleCommand, gifURL, message_description)
{
    return new Discord.MessageEmbed()
        .setTitle(titleCommand)
        .setURL(gifURL)
        .setImage(gifURL)
        .setAuthor(
            author.username,
            client.user.avatarURL
        )
        .setDescription(message_description)
        .setTimestamp(new Date())
        .setFooter(
            "totoboto4 nekos services",
            client.user.avatarURL
        );
}
