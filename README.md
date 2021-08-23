# totoboto4

This is the `totoboto4 Discord Bot`.
You can use it to create your bot, anyone can create modules that contains commands with the template [totoboto4-module-SDK](https://github.com/totobono4/totoboto4-module-SDK).

You need `node.js` to use this template, it includes `npm`, just download it from [there](https://nodejs.org/en/download/).

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

Step 3: totoboto4 should now work, you can run `npm run start` or the alias `npm start` to run the Release bot, you can run `npm run canary` to run the canary instance of the bot if you have one.

The bot already have the [totoboto4-module-SDK](https://github.com/totobono4/totoboto4-module-SDK) template included as a module, that provides a cool custom ping command, you can try it right now!

Now you're ready for create/import some modules to your bot, use [totoboto4-module-SDK](https://github.com/totobono4/totoboto4-module-SDK) to create a module, or import a module made by anyone.

You can import any module by enter this following command:  
`npm install https://github.com/<author>/<repo>`  
To make the bot use the module, you must add its name in the `config.json` file at the `module` array (It's going to be easier later :/), the name of the module should be the name of the repo in lower case, you can find it in `package.json` at `dependencies`.

You can remove a module by typing this command (with the lower case name again in `package.json` at `dependencies`):  
`npm remove <repo name in lower case>`  
/!\ Don't forget to remove the name of any module deleted from the `config.json` file at `module`.
