// normal lib declarations
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// RUN DEV: NODE_ENV=development node index.js
// get the env and read from our config accordingly
const env = process.env.NODE_ENV || 'production';
let token;
if(env == 'development'){
	console.log(">> launching in development mode");
	token = require('./config-dev.json')['token'];
	console.log(">> TOKEN: "+token);
}
else if(env == 'nightly'){
	console.log(">> launching in nightly mode");
	token = require('/usr/mitsuri/config-dev.json')['token'];
}
else{
	console.log(">> launching in production mode");
	token = require('/usr/mitsuri/config.json')['token'];
}

// build our client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
 
const pkg = require("./package.json")

client.once(Events.ClientReady, () => {
	console.log(">> Mitsuri Bot v"+pkg.version+" by Ryan Zmuda");
	rpc = 'with https://zoogies.live servers 😎';
	client.user.setActivity(rpc);
	console.log('>> RPC set -> Playing '+rpc);
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