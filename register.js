require('dotenv').config();
const config = require("./config.json");

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const token = process.env[config[mode].token];
const clientId = process.env[config[mode].clientId];

const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();