const { REST, Routes } = require('discord.js');
// const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');

// get the env and read from our config accordingly
const env = process.env.NODE_ENV || 'development';
let token;
let clientId;
if(env === 'development'){
	console.log(">> launching in development mode");
	token = require('./config-dev.json')['token'];
	clientId = require('./config-dev.json')['clientId'];
}
else{
	console.log(">> launching in production mode");
	token = require('/usr/mitsuri/config.json')['token'];
	clientId = require('/usr/mitsuri/config.json')['clientId'];
}

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();