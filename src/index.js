// normal lib declarations
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// openai
const { Configuration, OpenAIApi } = require("openai");

// pocketbase
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('https://db.zoogies.live');

// get the env and read from our config accordingly
const env = process.env.NODE_ENV || 'production';
let token;
let configuration;

if(env == 'development'){
	// header
	console.log(">> launching in development mode");
	token = require('./config-dev.json')['token'];
	//console.log(">> TOKEN: "+token);

	// openai object
	configuration = new Configuration({
		apiKey: require('./config-dev.json')['OPENAI_API_KEY'],
	});
	console.log(">> OPENAI_API_KEY LOADED");

	// login to pocketbase
	const authData = pb.admins.authWithPassword(require('./config-dev.json')['pb_email'], require('./config-dev.json')['pb_password']);
	console.log(">> Authenticated with db.zoogies.live")
}
else{
	// push slash commands for prod on first new run
	const { exec } = require('child_process');

	exec('npm run push', (error) => {
	  if (error) {
		console.error(`Error: ${error}`);
	  }
	});

	// header
	console.log(">> launching in production mode");
	token = require('/usr/mitsuri/config.json')['token'];

	// openai object
	configuration = new Configuration({
		apiKey: require('/usr/mitsuri/config.json')['OPENAI_API_KEY'],
	});
	// console.log(">> OPENAI_API_KEY LOADED");

	// login to pocketbase
	const authData = pb.admins.authWithPassword(require('/usr/mitsuri/config.json')['pb_email'], require('/usr/mitsuri/config.json')['pb_password']);
}

// build our client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// get version from package.json
const pkg = require("./package.json")
const ver = pkg.version;

// openai post init setup
const openai = new OpenAIApi(configuration);
module.exports = {
	openai,
	client,
	pb,
	env,
	ver
}; // allow this openai object to be accessed from our slash commands

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
 
client.once(Events.ClientReady, () => {
	console.log(">> Mitsuri Bot v"+ver+" by Ryan Zmuda");
	rpc = 'with https://zoogies.live servers 😎';
	client.user.setActivity(rpc);
	console.log('>> RPC set -> Playing '+rpc);
	console.log('>> Being wholesome in '+client.guilds.cache.size.toString()+' guilds')
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
console.log(">> Bot fully initialized.");