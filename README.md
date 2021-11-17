# totoboto4

This is the `totoboto4 Discord Bot`.
You can use it to create your bot, anyone can create modules that contains commands with the template [totoboto4-module-SDK](https://github.com/totobono4/totoboto4-module-SDK).

You need `node.js` to use this template, it includes `npm`, just download it from [there](https://nodejs.org/en/download/).
You need `Git` also, to use git and import github projects as npm modules, download git from [there](https://git-scm.com/).

Now, this is how to make it Work

Step 1: You need to install all the dependencies of the bot to make it works, just run this command:
`npm install`

Step 2: You need have tokens as environments variables, for this, create a `.env` file at the root of the project, and write the text below:
```.env
RELEASE_TOKEN=<Here your release token>
```
The `Release token` is the token from your bot, just put it there and the bot will totally work.
You can also set a `Canary token` but it's not necessary, this is usefull to run the same code on another bot for testing during developpement, without shutting down your bot between every tests.
You can add the `Canary token` by adding this line to the `.env` file.
```.env
CANARY_TOKEN=<Here your canary token>
```
To find your bot token, go to [this](https://discord.com/developers/applications) page and login with your discord account.  
If you don't have an app, create one. Click on your app, go to the "Bot" section, here is your token.  

Step 3: totoboto4 should now work, you can run `npm run start` or the alias `npm start` to run the Release bot, you can run `npm run canary` to run the canary instance of the bot if you have one.

The bot is now started, the base prefix of the release bot is a dot, so you should write `.<command>` to use any command.
You can run the `help` command, this command will always exists and automatically show all the modules and commands installed.

You can try it by implementing the [totoboto4-module-example](https://github.com/totobono4/totoboto4-module-example), just stop the bot and run the following command:  
`npm install https://github.com/totobono4/totoboto4-module-example.git`  
At this point, if you restart the bot, a new ping command will appear when you run the `help` command, and you'll be able to use it, just try it!

Now you're ready for create/import some modules to your bot, use [totoboto4-module-SDK](https://github.com/totobono4/totoboto4-module-SDK) to create a module, or import a module made by anyone.

You can import any module by entering the following command:  
`npm install https://github.com/<author>/<repo>.git`  

You can remove a module by typing this command (you can find the name of the module in `package.json` at `dependencies`, it's the repo name in lower case):  
`npm remove @totoboto4-module/<repo name in lower case>`  
