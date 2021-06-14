const Discord = require('discord.js');
const https = require('https');

const { client } = require("../../main.js");

const nekoclient = require('nekos.life');
const neko = new nekoclient();

let author;

const sfwCommands = neko.sfw;
const sfwKeys = Object.keys(sfwCommands);

const nsfwCommands = neko.nsfw;
const nsfwKeys = Object.keys(nsfwCommands);

exports.commands = ['nekohelp'].concat(sfwKeys).concat(nsfwKeys);

exports.process = async (prefix, message) => {

    author = message.author;

    if (message.content.startsWith(`${prefix}nekohelp`)) {
		help(message);
		return;
	}

    const nekommand = message.content.substring(1);

    if (message.content.startsWith(`${prefix}OwOify`))
    {
        OwOify(message, message.content.split(`${prefix}OwOify `).pop());
        return;
    }

    if (message.content.startsWith(`${prefix}`) && sfwKeys.includes(nekommand)) {
		sfw(message, nekommand);
		return;
	}

    if (!message.channel.nsfw)
    {
        message.channel.send('Vous ne pouvez pas utiliser cette commande dans ce salon :/');
        return;
    }

    if (message.content.startsWith(`${prefix}`) && nsfwKeys.includes(nekommand)) {
		nsfw(message, nekommand);
		return;
	}
}

async function OwOify(message, phrase) {
    let owo = await (await neko.sfw.OwOify({text: phrase}));

    message.channel.send("" + owo.owo);
}

async function sfw(message, nekommand) {
    const url = await (await sfwCommands[nekommand]()).url

    message.channel.send("" + url);
}

async function nsfw(message, nekommand) {
    const url = await (await nsfwCommands[nekommand]()).url

    message.channel.send("" + url);
}

async function help(message) {
    let help = 'commands :\n[ ' + sfwKeys.join(' - ') + '] ';
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

