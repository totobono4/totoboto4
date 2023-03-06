const fs = require('fs')
const path = require('path')

require('dotenv').config()
const config = require("./config.json")

let mode = null
if (process.argv.length >= 4) {
  command = process.argv[2]
  mode = process.argv[3]
}
const token = process.argv.length >= 4 ? process.env[config[mode].token] : null
const clientId = process.argv.length >= 4 ? process.env[config[mode].clientId] : null
const param5 = process.argv.length >= 5 ? process.argv[4] : null
const param6 = process.argv.length >= 6 ? process.argv[5] : null

const { Client, REST, Routes } = require('discord.js')
const Rest = new REST({ version: '10' }).setToken(token);

class Command {
  constructor() {}

  execute() {}
}

class ActiveModule extends Command {
  constructor(config_path, module_name, active) {
    super()
    this.config_path = config_path
    this.module_name = module_name
    this.active = active
    this.config = require(config_path)
  }

  execute() {
    if (this.config.modules[this.module_name] !== undefined) {
      this.config.modules[this.module_name].active = this.active === 'true' ? true : false;
      fs.writeFileSync(this.config_path, pretty_JSON(this.config))
    }
  }
}

class ShowCommands extends Command {
  constructor() {
    super()
  }

  async execute() {
    try {
      const online_commands = await Rest.get(Routes.applicationCommands(clientId));
      for (const online_command of online_commands) {
        console.log(online_command.name)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
}

class CleanModules extends Command {
  constructor() {
    super()
  }

  async execute() {
    try {
      console.log('Started deleting application (/) commands.');
      const online_commands = await Rest.get(Routes.applicationCommands(clientId));
      for (const online_command of online_commands) {
        await Rest.delete(Routes.applicationCommand(clientId, online_command.id))
      }
      console.log('Successfully deleted application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }
}

class RegisterModules extends Command {
  constructor(modules) {
    super()
    this.modules = modules
  }

  async execute() {
    const commands = []
    for (const module of this.modules) for (const command of module.commands) commands.push(command.application_command)

    try {
      console.log('Started refreshing application (/) commands.');
      await Rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  }
}

class UpdateModules extends Command {
  constructor(modules) {
    super()
    this.modules = modules
  }

  async execute() {
    new CleanModules().execute()
    new RegisterModules(this.modules).execute()
  }
}

class ModulesManager {
  constructor() {
    const config_file = "modules.json"
    const config_path = path.resolve(__dirname, config_file)
    if (!fs.existsSync(config_path)) fs.writeFileSync(config_path, "{}")

    this.config = require(config_path)
    if (this.config.modules == undefined) {
      this.config.modules = {}
      fs.writeFileSync(config_path, pretty_JSON(this.config))
    }

    const modules_dir = 'totoboto4_modules'
    const modules_path = path.resolve(__dirname, modules_dir)
    if (!fs.existsSync(modules_path)) fs.mkdirSync(modules_path)
    
    const modules_dirs = fs.readdirSync('totoboto4_modules')
    this.modules = []

    for (const module_dir of modules_dirs) {
      const module_dir_path = path.resolve(modules_path, module_dir)
      const module_path = path.resolve(path.resolve(module_dir_path, "module.js"))
      if (
        (fs.lstatSync(module_dir_path).isDirectory() || fs.lstatSync(module_dir_path).isSymbolicLink()) &&
        fs.lstatSync(module_path).isFile()
      ) this.modules.push(require(module_path))
    }

    for (const module of this.modules) {
      if (this.config.modules[module.name] === undefined) {
        this.config.modules[module.name] = {
          active: false
        }
        fs.writeFileSync(config_path, pretty_JSON(this.config))
      }
    }

    this.commands = {}
    this.commands.clean = new CleanModules()
    this.commands.register = new RegisterModules(this.active_modules)
    this.commands.update = new UpdateModules(this.active_modules)
    this.commands.show = new ShowCommands()
    this.commands.active = new ActiveModule(config_path, param5, param6)
  }

  get active_modules() {
    const modules = []
    for (const module of this.modules) {
      if (this.config.modules[module.name].active) {
        modules.push(module)
      }
    }
    return modules
  }

  /**
   * 
   * @param {Client} client 
   */
  launch(client) {
    for (const module of this.modules) {
      if (this.config.modules[module.name].active) {
        module.launch(client)
      }
    }
  }
}

function pretty_JSON(json) {
  return JSON.stringify(json, null, 2)
}

function main() {
  const utils = new ModulesManager()
  utils.commands[command].execute()
}

if (require.main === module) {
  main()
}

module.exports = new ModulesManager()
