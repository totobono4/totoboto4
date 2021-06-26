const Discord = require('discord.js');
const https = require('https');

const apiKey = require('./config.json').apiKey;

let danbooruCommand;
let author;

exports.commandsNSFW = [
    'danbooru'
]

exports.process = async (args, message) => {
    danbooruCommand = args[0];
    author = message.author;

    switch(danbooruCommand) {
        case 'danbooru':
            random(message);
            break;
        
        default:
            message.channel.send(`danbooru error`);
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