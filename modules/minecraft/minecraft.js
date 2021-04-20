const Discord = require("discord.js");
const { spawn } = require("child_process");
const bat = require.resolve("./servers/ProjectOzone3/start.bat");

const { client } = require("../../main.js");
const { Console } = require("console");
const { finished } = require("stream");

const channelIdServer = "828559514495090688";
const channelIdChat = "828571744670973962";

const regexServer = /(.*\[Server thread\/INFO\] \[minecraft\/DedicatedServer\]: [^\/].*|.*\[Server thread\/INFO\] \[minecraft\/MinecraftServer\]:.*)/;
const regexChatMinecraft = /\[Server thread\/INFO\] \[minecraft\/DedicatedServer\]: <(.*)> ([^\/].*)/;
const regexChatDiscord = /(^[^\/].*)/;
const regexOnline = /(.*\[Server thread\/INFO\] \[minecraft\/DedicatedServer\]: Done)/;

var server = null;
var serverStatut = "offline";

exports.whitelist = [
    "232047122868994049",
    "427251511500996608"
]

exports.commands = [
    "minecraft statut",
    "minecraft start",
    "minecraft stop"
]

exports.minecraftModule = async (prefix, message) => {

    if (message.content.startsWith(`${prefix}minecraft statut`)) {
		statutServer();
		return;
	}

    if (message.content.startsWith(`${prefix}minecraft start`)) {
		startServer();
		return;
	}

    if (message.content.startsWith(`${prefix}minecraft stop`)) {
		stopServer();
		return;
	}
}

client.on("message", async message => {

    if (message.author.bot || server == null) return;
    
    const ChannelServer = client.channels.cache.get(channelIdServer)
    const ChannelChat = client.channels.cache.get(channelIdChat)

    if (message.channel == ChannelChat && regexChatDiscord.test(message.content))
    {
        const result = message.content.match(regexChatDiscord);
        const dsPseudo = message.author.username;
        const dsMsg = result[1];
        
        server.stdin.write("say (discord)" + dsPseudo + ": " + dsMsg + "\n");
    }
});

async function statutServer()
{
    const ChannelServer = client.channels.cache.get(channelIdServer);

    ChannelServer.send("server statut : " + serverStatut);
}

async function startServer()
{
    const ChannelServer = client.channels.cache.get(channelIdServer)
    const ChannelChat = client.channels.cache.get(channelIdChat)

    if (serverStatut != "offline")
    {
        ChannelServer.send("minecraft server already started...");
        return;
    }

    server = spawn(bat);

    server.stdout.on('data', (data) => {
        if (regexServer.test(data)) ChannelServer.send("" + data);
        if (regexOnline.test(data))
        {
            serverStatut = "online";
            statutServer();
        }

        if (regexChatMinecraft.test(data))
        {
            const result = String(data).match(regexChatMinecraft);
            const mcPseudo = result[1];
            const mcMsg = result[2];
            ChannelChat.send("(minecraft)" + mcPseudo + ": " + mcMsg);
        }
    })

    server.stderr.on('data', function (data) {
        if (regexServer.test(data)) ChannelServer.send("" + data);
    });
    
    server.on('exit', function (code) {
        serverStatut = "offline";
        statutServer();
    });

    serverStarted = true;
    serverStatut = "starting";
    statutServer();
}

async function stopServer()
{
    const ChannelServer = client.channels.cache.get(channelIdServer)

    if (serverStatut != "online") 
    {
        ChannelServer.send("Cannot stop a dead server.");
        return;
    }

    server.stdin.write("stop\n");
    server.stdin.end();
    serverStatut = "shutting"
    statutServer();
}