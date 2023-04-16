const fs = require('fs')
const path = require('path')

require('dotenv').config()
const config = require('./config.json')

let mode = null
let command = null
if (process.argv.length >= 4) {
  command = process.argv[2]
  mode = process.argv[3]
}
const token = process.argv.length >= 4 ? process.env[config[mode].token] : null
const clientId = process.argv.length >= 4 ? process.env[config[mode].clientId] : null
const param5 = process.argv.length >= 5 ? process.argv[4] : null
const param6 = process.argv.length >= 6 ? process.argv[5] : null

const { REST, Routes } = require('discord.js')
const Rest = new REST({ version: '10' }).setToken(token)

class Command {
  execute () {}
}

class ActiveModule extends Command {
  constructor (configPath, moduleName, active) {
    super()
    this.config_path = configPath
    this.module_name = moduleName
    this.active = active
    this.config = require(configPath)
  }

  execute () {
    if (this.config.modules[this.module_name] !== undefined) {
      this.config.modules[this.module_name].active = this.active === 'true'
      fs.writeFileSync(this.config_path, prettyJSON(this.config))
    }
  }
}

class ShowCommands extends Command {
  async execute () {
    try {
      const onlineCommands = await Rest.get(Routes.applicationCommands(clientId))
      for (const onlineCommand of onlineCommands) {
        console.log(onlineCommand.name)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

class CleanModules extends Command {
  async execute () {
    try {
      console.log('Started deleting application (/) commands.')
      const onlineCommands = await Rest.get(Routes.applicationCommands(clientId))
      for (const onlineCommand of onlineCommands) {
        await Rest.delete(Routes.applicationCommand(clientId, onlineCommand.id))
      }
      console.log('Successfully deleted application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  }
}

class RegisterModules extends Command {
  constructor (modules) {
    super()
    this.modules = modules
  }

  async execute () {
    const commands = []
    for (const module of this.modules) for (const command of module.commands) commands.push(command)

    try {
      console.log('Started refreshing application (/) commands.')
      await Rest.put(Routes.applicationCommands(clientId), { body: commands })
      console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  }
}

class UpdateModules extends Command {
  constructor (modules) {
    super()
    this.modules = modules
  }

  async execute () {
    new CleanModules().execute()
    new RegisterModules(this.modules).execute()
  }
}

class ModulesManager {
  constructor () {
    const configFile = 'modules.json'
    const configPath = path.resolve(__dirname, configFile)
    if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, '{}')

    this.config = require(configPath)
    if (this.config.modules === undefined) {
      this.config.modules = {}
      fs.writeFileSync(configPath, prettyJSON(this.config))
    }

    const modulesDir = 'totoboto4_modules'
    const modulesPath = path.resolve(__dirname, modulesDir)
    if (!fs.existsSync(modulesPath)) fs.mkdirSync(modulesPath)

    const modulesDirs = fs.readdirSync('totoboto4_modules')
    this.modules = []

    for (const moduleDir of modulesDirs) {
      const moduleDirPath = path.resolve(modulesPath, moduleDir)
      const modulePath = path.resolve(path.resolve(moduleDirPath, 'module.js'))
      if (
        (fs.lstatSync(moduleDirPath).isDirectory() || fs.lstatSync(moduleDirPath).isSymbolicLink()) &&
        fs.lstatSync(modulePath).isFile()
      ) this.modules.push(require(modulePath))
    }

    for (const module of this.modules) {
      if (this.config.modules[module.name] === undefined) {
        this.config.modules[module.name] = {
          active: false
        }
        fs.writeFileSync(configPath, prettyJSON(this.config))
      }
    }

    this.commands = {}
    this.commands.clean = new CleanModules()
    this.commands.register = new RegisterModules(this.active_modules)
    this.commands.update = new UpdateModules(this.active_modules)
    this.commands.show = new ShowCommands()
    this.commands.active = new ActiveModule(configPath, param5, param6)
  }

  get active_modules () {
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
  launch (client) {
    for (const module of this.modules) {
      if (this.config.modules[module.name].active) {
        module.launch(client)
      }
    }
  }
}

function prettyJSON (json) {
  return JSON.stringify(json, null, 2)
}

function main () {
  const utils = new ModulesManager()
  utils.commands[command].execute()
}

if (require.main === module) {
  main()
}

module.exports = new ModulesManager()
