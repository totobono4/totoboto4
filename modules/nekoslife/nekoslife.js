const Discord = require('discord.js');
const https = require('https');

const { client } = require("../../main.js");

const NekosLife = require('nekos.life');
const nekoclient = new NekosLife();

let nekommand;
let author;

exports.commands = [
    'smug',
    'baka',
    'tickle',
    'slap',
    'poke',
    'pat',
    'neko',
    'nekogif',
    'meow',
    'lizard',
    'kiss',
    'hug',
    'foxgirl',
    'feed',
    'cuddle',
    'kemonomimi',
    'holo',
    'woof',
    'wallpaper',
    'goose',
    'gecg',
    'avatar',
    'waifu',

    'why',
    'cattext',
    'owoify',
    '8ball',
    'fact',
    'spoiler'
]

exports.commandsNSFW = [
    'randomhentaigif',
    'pussy',
    'nsfwnekogif',
    'nsfwneko',
    'lesbian',
    'kuni',
    'cumsluts',
    'classic',
    'boobs',
    'bj',
    'anal',
    'nsfwavatar',
    'yuri',
    'trap',
    'tits',
    'girlsologif',
    'girlsolo',
    'pussywankgif',
    'pussyart',
    'nsfwkemonomimi',
    'kitsune',
    'keta',
    'nsfwholo',
    'holoero',
    'hentai',
    'futanari',
    'femdom',
    'feetgif',
    'erofeet',
    'feet',
    'ero',
    'erokitsune',
    'erokemonomimi',
    'eroneko',
    'eroyuri',
    'cumarts',
    'blowjob',
    'spank',
    'gasm'
]

exports.process = async (args, message) => {
    nekommand = args[0];
    author = message.author;

    switch(nekommand) {
        case 'smug':
            actions(message, nekoclient.sfw.smug);
            break;
        case 'baka':
            actions(message, nekoclient.sfw.baka);
            break;
        case 'tickle':
            actions(message, nekoclient.sfw.tickle);
            break;
        case 'slap':
            actions(message, nekoclient.sfw.slap);
            break;
        case 'poke':
            actions(message, nekoclient.sfw.poke);
            break;
        case 'pat':
            actions(message, nekoclient.sfw.pat);
            break;
        case 'neko':
            actions(message, nekoclient.sfw.neko);
            break;
        case 'nekogif':
            actions(message, nekoclient.sfw.nekoGif);
            break;
        case 'meow':
            actions(message, nekoclient.sfw.meow);
            break;
        case 'lizard':
            actions(message, nekoclient.sfw.lizard);
            break;
        case 'kiss':
            actions(message, nekoclient.sfw.kiss);
            break;
        case 'hug':
            actions(message, nekoclient.sfw.hug);
            break;
        case 'foxgirl':
            actions(message, nekoclient.sfw.foxGirl);
            break;
        case 'feed':
            actions(message, nekoclient.sfw.feed);
            break;
        case 'cuddle':
            actions(message, nekoclient.sfw.cuddle);
            break;
        case 'kemonomimi':
            actions(message, nekoclient.sfw.kemonomimi);
            break;
        case 'holo':
            actions(message, nekoclient.sfw.holo);
            break;
        case 'woof':
            actions(message, nekoclient.sfw.woof);
            break;
        case 'wallpaper':
            actions(message, nekoclient.sfw.wallpaper);
            break;
        case 'goose':
            actions(message, nekoclient.sfw.goose);
            break;
        case 'gecg':
            actions(message, nekoclient.sfw.gecg);
            break;
        case 'avatar':
            actions(message, nekoclient.sfw.avatar);
            break;
        case 'waifu':
            actions(message, nekoclient.sfw.waifu);
            break;

        case 'why':
            why(message);
            break;
        case 'cattext':
            catText(message);
            break;
        case 'owoify':
            if (args.length > 1) {
                OwOify(message, args);
            }
            else {
                message.channel.send(
                    nekosMessage('neko error', null, `La nekommand ${nekommand} veut que tu lui donnes des mots à manger èwé.`)
                );
            }
            break;
        case '8ball':
            ball(message, args);
            break;
        case 'fact':
            fact(message);
            break;
        case 'spoiler':
            if (args.length > 1) {
                spoiler(message, args);
            }
            else {
                message.channel.send(
                    nekosMessage('neko error', null, `La nekommand ${nekommand} veut que tu lui donnes des lettres à spoiler.`)
                );
            }
            break;

        case 'randomhentaigif':
            actions(message, nekoclient.nsfw.randomHentaiGif);
            break;
        case 'pussy':
            actions(message, nekoclient.nsfw.pussy);
            break;
        case 'nsfwnekogif':
            actions(message, nekoclient.nsfw.nekoGif);
            break;
        case 'nsfwneko':
            actions(message, nekoclient.nsfw.neko);
            break;
        case 'lesbian':
            actions(message, nekoclient.nsfw.lesbian);
            break;
        case 'kuni':
            actions(message, nekoclient.nsfw.kuni);
            break;
        case 'cumsluts':
            actions(message, nekoclient.nsfw.cumsluts);
            break;
        case 'classic':
            actions(message, nekoclient.nsfw.classic);
            break;
        case 'boobs':
            actions(message, nekoclient.nsfw.boobs);
            break;
        case 'bj':
            actions(message, nekoclient.nsfw.bJ);
            break;
        case 'anal':
            actions(message, nekoclient.nsfw.anal);
            break;
        case 'nsfwavatar':
            actions(message, nekoclient.nsfw.avatar);
            break;
        case 'yuri':
            actions(message, nekoclient.nsfw.yuri);
            break;
        case 'trap':
            actions(message, nekoclient.nsfw.trap);
            break;
        case 'tits':
            actions(message, nekoclient.nsfw.tits);
            break;
        case 'girlsologif':
            actions(message, nekoclient.nsfw.girlSoloGif);
            break;
        case 'girlsolo':
            actions(message, nekoclient.nsfw.girlSolo);
            break;
        case 'pussywankgif':
            actions(message, nekoclient.nsfw.pussyWankGif);
            break;
        case 'pussyart':
            actions(message, nekoclient.nsfw.pussyArt);
            break;
        case 'nsfwkemonomimi':
            actions(message, nekoclient.nsfw.kemonomimi);
            break;
        case 'kitsune':
            actions(message, nekoclient.nsfw.kitsune);
            break;
        case 'keta':
            actions(message, nekoclient.nsfw.keta);
            break;
        case 'nsfwholo':
            actions(message, nekoclient.nsfw.holo);
            break;
        case 'holoero':
            actions(message, nekoclient.nsfw.holoEro);
            break;
        case 'hentai':
            actions(message, nekoclient.nsfw.hentai);
            break;
        case 'futanari':
            actions(message, nekoclient.nsfw.futanari);
            break;
        case 'femdom':
            actions(message, nekoclient.nsfw.femdom);
            break;
        case 'feetgif':
            actions(message, nekoclient.nsfw.feetGif);
            break;
        case 'erofeet':
            actions(message, nekoclient.nsfw.eroFeet);
            break;
        case 'feet':
            actions(message, nekoclient.nsfw.feet);
            break;
        case 'ero':
            actions(message, nekoclient.nsfw.ero);
            break;
        case 'erokitsune':
            actions(message, nekoclient.nsfw.eroKitsune);
            break;
        case 'erokemonomimi':
            actions(message, nekoclient.nsfw.eroKemonomimi);
            break;
        case 'eroneko':
            actions(message, nekoclient.nsfw.eroNeko);
            break;
        case 'eroyuri':
            actions(message, nekoclient.nsfw.eroYuri);
            break;
        case 'cumarts':
            actions(message, nekoclient.nsfw.cumArts);
            break;
        case 'blowjob':
            actions(message, nekoclient.nsfw.blowJob);
            break;
        case 'spank':
            actions(message, nekoclient.nsfw.spank);
            break;
        case 'gasm':
            actions(message, nekoclient.nsfw.gasm);
            break;

        default :
            message.channel.send(
                nekosMessage('neko error', null, `La nekommand ${nekommand} n'existe pas.`)
            );
    }
}

async function actions(message, action) {
    const actionRes = await (await action());
    const url = actionRes.url;
    const mentionnedUsers = message.mentions.users;

    if (mentionnedUsers.size > 0) {
        message.channel.send(
            nekosMessage(nekommand, url, `**${author.username}**.${nekommand}(**${mentionnedUsers.first().username}**);`)
        );
    }
    else {
        message.channel.send(
            nekosMessage(nekommand, url, '')
        );
    }
}

async function spoiler(message, args) {
    args.shift();
    const spoilerRes = await(await nekoclient.sfw.spoiler({text: args.join(" ")}));

    message.channel.send(
        nekosMessage(nekommand, null, `${spoilerRes.owo}`)
    );
}

async function catText(message) {
    const catTextRes = await (await nekoclient.sfw.catText());

    message.channel.send(
        nekosMessage(nekommand, null, `${catTextRes.cat}`)
    );
}

async function why(message) {
    const whyRes = await (await nekoclient.sfw.why());

    message.channel.send(
        nekosMessage(nekommand, null, `${whyRes.why}`)
    );
}

async function OwOify(message, args) {
    args.shift();
    const OwOifyRes = await (await nekoclient.sfw.OwOify({text: args.join(" ")}));

    message.channel.send(
        nekosMessage(nekommand, null, `${OwOifyRes.owo}`)
    );
}

async function fact(message) {
    const factRes = await (await nekoclient.sfw.fact());

    message.channel.send(
        nekosMessage(nekommand, null, `${factRes.fact}`)
    );
}

async function ball(message, args) {
    args.shift();
    const ballRes = await (await nekoclient.sfw['8Ball']({text: args.join(" ")}));

    message.channel.send(
        nekosMessage(nekommand, ballRes.url, `${ballRes.response}`)
    );
}

async function nsfw(message, nekommand) {
    const url = await (await nsfwNewCommands[nekommand]()).url

    const mentionnedUsers = message.mentions.users;

    if (mentionnedUsers.size > 0) {
        message.channel.send(
            nekosMessage(nekommand, url, `**${author.username}**.${nekommand}(**${mentionnedUsers.first().username}**);`)
        );
    }
    else {
        message.channel.send(
            nekosMessage(nekommand, url, '')
        );
    }
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
