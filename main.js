process.env.TOTOBOTENV = __dirname
require('dotenv').config()
const config = require('./config.json')
const gitVersion = require('git-tag-version')

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

client.once('ready', () => {
  console.log('Ready!')
})

client.once('reconnecting', () => {
  console.log('Reconnecting!')
})

client.once('disconnect', () => {
  console.log('Disconnect!')
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

require('./modulesManager').launch(client)

client.login(process.env[token])

console.log(`release : ${gitVersion()}`)
console.log(`mode : [ ${mode} ]`)
