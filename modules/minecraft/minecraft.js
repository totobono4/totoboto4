const Discord = require("discord.js");
const { spawn } = require("child_process");
const Path = require("path");
const FileSystem = require('fs');

const { client } = require("../../main.js");
const { Console } = require("console");
const { finished } = require("stream");

const serverFileName = Path.resolve(__dirname, "servers.json");
const serverJson = require(serverFileName);
const { cwd } = require("process");

const channelIdServer = serverJson.channelIdServer;
const channelIdChat = serverJson.channelIdChat;

let serverPath = null;
let bat = null;

let regexServer = null;
let regexChatMinecraft = null;
let regexChatDiscord = /(^[^\/].*)/;
let regexOnline = null;

var server = null;
var serverStatut = "offline";
const statut = {
    starting : "starting",
    online   : "online",
    shutting : "shutting",
    offline  : "offline"
}

exports.whitelist = [
    "232047122868994049",
    "427251511500996608"
]

exports.commands = {
    test:     "minecraft test",

    //versions: "minecraft versions",

    list:     "minecraft list",
    select:   "minecraft select",

    statut:   "minecraft statut",
    start:    "minecraft start",
    stop:     "minecraft stop"
}

exports.minecraftModule = async (prefix, message) => {

    if (message.content.startsWith(`${prefix}${this.commands.versions}`)) {
		listVersions();
		return;
	}

    if (message.content.startsWith(`${prefix}${this.commands.list}`)) {
		listServers();
		return;
	}

    if (message.content.startsWith(`${prefix}${this.commands.select}`)) {
		selectServer(message.content.split(`${prefix}${this.commands.select} `).pop());
		return;
	}

    if (serverJson.selected == null)
    {
        const ChannelServer = client.channels.cache.get(channelIdServer)
        ChannelServer.send('aucun serveur n\'est sélectionné:');
        listServers();
        return;
    }

    serverPath = Path.resolve(__dirname , serverJson.servers[serverJson.selected].path);
    bat = Path.resolve(serverPath, 'start.bat');

    regexServer        = new RegExp(serverJson.servers[serverJson.selected].regex.server);
    regexChatMinecraft = new RegExp(serverJson.servers[serverJson.selected].regex.chatMinecraft);
    regexOnline        = new RegExp(serverJson.servers[serverJson.selected].regex.online);

    if (message.content.startsWith(`${prefix}${this.commands.statut}`)) {
		statutServer();
		return;
	}

    if (message.content.startsWith(`${prefix}${this.commands.start}`)) {
		startServer();
		return;
	}

    if (message.content.startsWith(`${prefix}${this.commands.stop}`)) {
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

async function listVersions()
{
    const ChannelServer = client.channels.cache.get(channelIdServer)
}

async function listServers()
{
    const ChannelServer = client.channels.cache.get(channelIdServer)

    if (Object.keys(serverJson.servers).length > 0) ChannelServer.send(Object.keys(serverJson.servers));
    else ChannelServer.send("Aucun serveur dans la base de donnée.");
}

async function selectServer(selectedServer)
{
    const ChannelServer = client.channels.cache.get(channelIdServer)

    if (serverJson.servers[selectedServer] == undefined)
    {
        ChannelServer.send(['le serveur', selectedServer, 'n\'existe pas.'].join(" "));
        return;
    }

    serverJson.selected = selectedServer;

    FileSystem.writeFile(serverFileName, JSON.stringify(serverJson, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
        ChannelServer.send(['Serveur', selectedServer, 'sélectionné avec succès.'].join(" "));
    });
}

async function statutServer()
{
    const ChannelServer = client.channels.cache.get(channelIdServer);

    ChannelServer.send("server statut : " + serverStatut);
}

async function startServer()
{
    const ChannelServer = client.channels.cache.get(channelIdServer)
    const ChannelChat = client.channels.cache.get(channelIdChat)

    if (serverStatut != statut.offline)
    {
        ChannelServer.send("minecraft server already started...");
        return;
    }

    server = spawn(bat, { cwd: serverPath });

    server.stdout.on('data', (data) => {

        if (regexServer.test(data)) ChannelServer.send("" + data);
        if (regexOnline.test(data))
        {
            serverStatut = statut.online;
            logMessage = null;
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
        console.log("" + data);
        if (regexServer.test(data)) ChannelServer.send("" + data);
    });
    
    server.on('exit', function (code) {
        serverStatut = statut.offline;
        logMessage = null;
        statutServer();
    });

    serverStarted = true;
    serverStatut = statut.starting;
    statutServer();
}

async function stopServer()
{
    const ChannelServer = client.channels.cache.get(channelIdServer)

    if (serverStatut != statut.online) 
    {
        ChannelServer.send("Cannot stop a dead server.");
        return;
    }

    server.stdin.write("stop\n");
    server.stdin.end();
    serverStatut = statut.shutting;
    statutServer();
}