// normal lib declarations
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// openai
const { Configuration, OpenAIApi } = require("openai");

// pocketbase
const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('https://db.zoogies.dev');

// get the env and read from our config accordingly
const env = process.env.NODE_ENV || 'production';
let token, configuration, elevenTOKEN;

if (env === 'development') {
	console.log(">> launching in development mode");

	const configDev = require('./config-dev.json');
	token = configDev.token;
	configuration = new Configuration({
		apiKey: configDev.OPENAI_API_KEY
	});
	console.log(">> OPENAI_API_KEY LOADED");
	
	elevenTOKEN = configDev.eleven_api_key;
	console.log(">> ELEVEN API KEY LOADED");
	
	const authData = pb.admins.authWithPassword(configDev.pb_email, configDev.pb_password);
	console.log(">> Authenticated with db.zoogies.dev");
} 
else {
	console.log(">> launching in production mode");

	const configProd = require('/usr/mitsuri/config.json');
	token = configProd.token;
	configuration = new Configuration({
		apiKey: configProd.OPENAI_API_KEY
	});

	console.log(">> ELEVEN API KEY LOADED");

	const { exec } = require('child_process');

	exec('npm run push', (error) => {
		if (error) {
		console.error(`Error: ${error}`);
		}
	});

	const pb_email = configProd.pb_email;
	const pb_pass = configProd.pb_password;
	const authData = pb.admins.authWithPassword(pb_email, pb_pass);
}

// build our client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

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
	ver,
	elevenTOKEN
}; // allow this openai object to be accessed from our slash commands

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	// console.log(">> Loading command "+filePath);
	const command = require(filePath);
	// console.log(">> ",command.data.name)
	// console.log(">> ",command.data)
	client.commands.set(command.data.name, command);
}
 
client.once(Events.ClientReady, () => {
	console.log(">> Mitsuri Bot v"+ver+" by Ryan Zmuda");
	rpc = 'with https://zoogies.dev servers 😎';
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

// async function delta_uuid_rep(vanity_name,uuid,delta) {
// 	// console.log(">> plus_one_uuid_rep called for "+uuid);

// 	const resultList = await pb.collection('usercache').getList(1, 1, {
// 		filter: `uuid="${uuid}"`,
// 	});

// 	// if there is no item, create it with rep 1
// 	if(resultList.items.length == 0){
// 		await pb.collection('usercache').create({uuid: uuid, rep: delta, vanity_name: vanity_name});
// 		return delta;
// 	}

// 	// if there is an item, increment its rep by 1
// 	const user = resultList.items[0];
// 	const rep = user.rep + delta;
// 	await pb.collection('usercache').update(user.id, {rep: rep});

// 	return rep;
// }

// client.on(Events.MessageCreate, async message => {
// 	if (message.author.bot) return;

// 	content = message.content;
// 	if (content.startsWith("+1")) {
// 		delta = 1;
// 	}
// 	else if (content.startsWith("-1")) {
// 		delta = -1;
// 	}
// 	else {
// 		return
// 	}

// 	replied_user = message.mentions.repliedUser;
// 	replied_uuid = null;
// 	is_reply = replied_user != null;
// 	sender_id = message.author.id;
// 	rep_content = null
// 	// console.log(">> +1 detected from "+sender_id);
// 	// console.log(">> is_reply: "+is_reply);
// 	// console.log(">> replied_user: "+replied_user);

// 	// enforce a cooldown
// 	let user = null;
// 	try {
// 		user = await pb.collection('rep').getFirstListItem(`sender="${sender_id}"`, { sort: '-created' });
	
// 		if (user != null) { // && env === 'production'
// 			const userCreatedDate = new Date(user.created);
// 			const currentTime = Date.now();
			
// 			// const cd = 3600000; // 3600000 ms = 1 hour
// 			const cd = 7200000; // 7200000 ms = 2 hours
		
// 			// console.log(">> currentTime: " + currentTime);
// 			// console.log(">> userCreatedDate: " + userCreatedDate.getTime());
// 			// console.log(">> diff: " + (currentTime - userCreatedDate.getTime()));
		
// 			// Compare the dates
// 			const elapsedTime = currentTime - userCreatedDate.getTime();
// 			if (elapsedTime < cd) {
// 				const remainingCooldown = Math.ceil((cd - elapsedTime) / 60000); // Convert remaining milliseconds to minutes
// 				message.reply("You can only rep once every 2 hours! 😡\nYou are on cooldown for: " + remainingCooldown + " minutes");
// 				return;
// 			}
// 		}
// 	}
// 	catch (error) {
// 		console.log("An ignorable error occurred, this is being logged for debugging purposes.");
// 		console.error(error);
// 		console.log("This error is ALMOST POSITIVELY related to a new person showing up in pocketbase.");
// 	}

// 	if(!is_reply){
// 		// detect the message right above it
// 		const messages = await message.channel.messages.fetch({ limit: 2 });
// 		const lastMessage = messages.last();
// 		replied_user = lastMessage.author;
// 		replied_uuid = replied_user.id;
// 		// console.log(">> lastMessage: "+lastMessage.content);
// 		rep_content = lastMessage.content;
// 	}
// 	else{
// 		replied_uuid = replied_user.id;

// 		const repliedTo = await message.fetchReference();
// 		rep_content = repliedTo.content;
// 	}
// 	// console.log(">> repliedTo: "+rep_content);

// 	if(replied_user == sender_id){
// 		let sass = ['😒', '🙄', '😑', '😠', '😾', '💢'];
// 		message.reply("You can't rep yourself! "+sass[Math.floor(Math.random() * sass.length)]);
// 		return;
// 	}

// 	// todo, check if repping the same message twice? only if meta is being abused

// 	// check if the user is replying to a message with content "+1" or "-1", or in the case that its not a reply, the message above it
// 	if(rep_content.startsWith("+1") || rep_content.startsWith("-1")){
// 		message.reply("Rep trading is cringe. -1 for you. 😡");

// 		// prep database operation
// 		let data = {
// 			"sender": sender_id,
// 			"recipient": sender_id,
// 			"sender_vanity_name": "Mitsuri_Penalty_Self_Rep",
// 			"recipient_vanity_name": message.author.username, // bad naming convention, sue me, im tired
// 			"rep_message": content,
// 			"delta": -1,
// 		};

// 		// perform database operation
// 		await pb.collection('rep').create(data);

// 		// get rep count
// 		try{
// 			const repCount = await delta_uuid_rep(message.author.username,sender_id,-1);
// 			message.channel.send("<@"+sender_id+"> now has **"+repCount+"** rep!");
// 		}
// 		catch(e){
// 			message.channel.send("Something went wrong! 😢");
// 		}

// 		return;
// 	}

// 	// prep database operation
// 	let data = {
// 		"sender": sender_id,
// 		"recipient": replied_uuid,
// 		"sender_vanity_name": message.author.username,
// 		"recipient_vanity_name": replied_user.username, // bad naming convention, sue me, im tired
// 		"rep_message": rep_content,
// 		"delta": delta,
// 	};

// 	// perform database operation
// 	await pb.collection('rep').create(data);
// 	// message.react('👍');

// 	// get rep count
// 	try{
// 		const repCount = await delta_uuid_rep(replied_user.username,replied_uuid,delta);
// 		message.channel.send("<@"+replied_user+"> now has **"+repCount+"** rep!");
// 	}
// 	catch(e){
// 		message.channel.send("Something went wrong! 😢");
// 	}
// });

client.login(token);
console.log(">> Bot fully initialized.");