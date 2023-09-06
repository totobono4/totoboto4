process.env.TOTOBOTENV = __dirname
require('dotenv').config()
const config = require('./config.json')
const gitVersion = require('git-tag-version')
const debug = require('./debugger')

let mode = null
if (process.argv.length === 3) mode = process.argv[2]
const token = config[mode].token

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages
  ]
})

debug.debug(debug.layers.Bot, debug.types.Debug, "Starting totoboto4...", [`release : [ ${gitVersion()} ]`, `mode : [ ${mode} ]`])

client.once('ready', () => {
  debug.debug(debug.layers.Bot, debug.types.Debug, "Ready!")
})

client.once('reconnecting', () => {
  debug.debug(debug.layers.Bot, debug.types.Debug, "Reconnecting...")
})

client.once('disconnect', () => {
  debug.debug(debug.layers.Bot, debug.types.Debug, "Disconnect.")
})

client.on('ready', () => {
  debug.debug(debug.layers.Bot, debug.types.Debug, `Logged in as ${client.user.tag}!`)
})

require('./modulesManager').launch(client)

client.login(process.env[token])
