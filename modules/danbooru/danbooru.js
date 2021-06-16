const Discord = require('discord.js');
const https = require('https');

const apiKey = require('./config.json').apiKey;

let author;

exports.commands = [
    'danbooru'
]

exports.process = async (prefix, args, message) => {

    author = message.author;

    if (!message.channel.nsfw)
    {
        message.channel.send('Vous ne pouvez pas utiliser cette commande dans ce salon :/');
        return;
    }

    if (message.content.startsWith(`${prefix}danbooru`)) {
		random(message);
		return;
	}
}

function random(message)
{
    const options = {
        hostname: 'danbooru.donmai.us',
        method: 'GET',
        path: '/posts/random.json'
    }

    const req = https.request(options, res => {
        let rawdata = '';
      
        res.on('data', d => {
            rawdata += d;
        })

        res.on('end', () => {
            const json = JSON.parse(rawdata);
            const image = json.file_url;

            message.channel.send("" + image);
        })
    })

    req.on('error', error => {
        console.error(error)
    })
    
    req.end()
}