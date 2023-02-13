require('dotenv').config();
const config = require("./config.json");

let mode = null;
if (process.argv.length === 3) mode = process.argv[2];
const token = process.env[config[mode].token];
const clientId = process.env[config[mode].clientId];

const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started deleting application (/) commands.');

    const commands = await rest.get(Routes.applicationCommands(clientId));

    for (command of commands) {
        await rest.delete(Routes.applicationCommand(clientId, command.id))
    }

    console.log('Successfully deleted application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();