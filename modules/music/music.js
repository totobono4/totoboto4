const Discord = require("discord.js");
const ytdl = require("ytdl-core");

const queue = new Map();
const { client } = require("../../main.js");

let musicCommand;
let author;
let loop = 0;

exports.commands = [
    "play",
    "skip",
    "stop",
    "loop",
    "oneloop",
    "unloop"
]

exports.process = async (args, message) => {
    musicCommand = args[0];
    const serverQueue = queue.get(message.guild.id);
    author = message.author;

    switch(musicCommand) {
        case 'play':
            execute(message, serverQueue);
            break;
        case 'skip':
            skip(message, serverQueue);
            break;
        case 'stop':
            stop(message, serverQueue);
            break;
        case 'loop':
            loopCommands(message, 1);
            break;
        case 'oneloop':
            loopCommands(message, 2);
            break;
        case 'unloop':
            loopCommands(message, 0);
            break;

        default:
            message.channel.send(
                musicMessage(`music error`, null, `Cette commande n'existe pas.`)
            );
    }
}

async function execute(message, serverQueue) {
    const args = message.content.split(" ");
    const voiceChannel = message.member.voice.channel;
    
    if (!voiceChannel)
        return message.channel.send(
            musicMessage("Play command bad request!", "", "Aller dans un vocal pour ajouter une musique à la playlist!")
        );
    
    const permissions = voiceChannel.permissionsFor(message.client.user);
    
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
    {
        return message.channel.send(
            musicMessage("Play command bad request!", "", "Je n\'ai pas les permissions d\'accéder à ce vocal! :/")
        );
    }

    var song;

    try
    {
        const songInfo = await ytdl.getInfo(args[1]);
        song =
        {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
    }
    catch
    {
        return message.channel.send(
            musicMessage("Play command bad request!", "", "Mauvais lien :c")
        );
    }

    if (!serverQueue)
    {
        const queueContruct =
        {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try
        {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        }
        catch (err)
        {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    }
    else
    {
        serverQueue.songs.push(song);
        return message.channel.send(
            musicMessage(song.title, song.url, "Musique ajoutée à la playlist!")
        );
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            musicMessage("Skip command bad request!", "", "Allez dans un vocal pour skipper cette musique!")
        );
    
    if (!serverQueue)
        return message.channel.send(
            musicMessage("Skip command bad request!", "", "Il n\'y a aucune musique à skipper! :/")
        );
        
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            musicMessage("Stop command bad request!", "", "Aller dans un vocal pour stopper cette musique!")
        );
    
    if (!serverQueue)
        return message.channel.send(
            musicMessage("Stop command bad request!", "", "Il n\'y a aucune musique à stopper! :/")
        );
    
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();

    return message.channel.send(
        musicMessage("Stop command", "", "La musique a été stoppée!")
    );
}

function loopCommands(message, loopvalue)
{
    loop = loopvalue;

    if (loop == 0)
        return message.channel.send(
            musicMessage("Unloop command", "", "Le mode boucle est désactivé, les musiques défileront normalement!")
        );
    if (loop == 1)
        return message.channel.send(
            musicMessage("Loop command", "", "Le mode boucle est activé, la playlist tournera en boucle!")
        );
    if (loop == 2)
        return message.channel.send(
            musicMessage("Oneloop command", "", "Le mode boucle unique est activé, la musique actuelle tournera en boucle!")
        );
}

function play(guild, song) {
    
    const serverQueue = queue.get(guild.id);
    
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
    
        .play(ytdl(song.url))
    
        .on("finish", () => {
            if (loop == 0)
                serverQueue.songs.shift();
            if (loop == 1)
                serverQueue.songs.push(serverQueue.songs.shift());
            play(guild, serverQueue.songs[0]);
        })
    
        .on("error", error => console.error(error));
    
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
    serverQueue.textChannel.send(
        musicMessage(song.title, song.url, "Musique maintenant jouée!")
    );
}

function musicMessage(song_title, song_url, message_description)
{
    return new Discord.MessageEmbed()
        .setTitle(song_title)
        .setURL(song_url)
        .setAuthor(
            author.username,
            client.user.avatarURL
        )
        .setDescription(message_description)
        .setTimestamp(new Date())
        .setFooter(
            "totoboto4 music services",
            client.user.avatarURL
        );
}
