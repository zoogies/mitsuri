// Require the necessary discord.js classes
const { Client, Intents, MessageFlags } = require('discord.js');
const { token } = require('./config.json');
//const config = require('./rpc.json');
const axios = require('axios');
//const DiscordRPC = require('discord-rpc');
//const RPC = new DiscordRPC.Client({transport:'ipc'});
//DiscordRPC.register(config.ClientID);

const prefix = "!prompt"
const options = ['characters','animals','situations','objects']
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

//async function setActivity(){
//    if(!RPC) return;
//    RPC.setActivity({
//        details: 'CC 2018',
//        largeImageKey: 'sleppy',
//        smallImageKey: 'sleppy',
//        largeImageText: 'Adobe Photoshop',
//        smallImageText: 'Editing',
//    });
//}

client.on("ready", () => {
  console.log("Art Prompt Bot v4.22.22 >> Ryan Zmuda");
  client.user.setPresence({ activities: [{ name: 'with Mitsuri Kanroji\'s boobs' }], status: 'online' });
  //RPC.on('ready', async () => {
  //  setActivity();
  //  })
//RPC.login(config.ClientID);
});

client.on("messageCreate", (message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
  if (message.content.startsWith("!prompt")) {
    if(options.includes(args[0].toLowerCase())){
        axios.post('https://artsideoflife.com/api/read.php',"category="+args[0]).then((response) => {
            message.channel.send(response.data);
        }, (error) => {
            console.log(error);
        });
    }
    else if(args[0] === 'list'){
        message.channel.send('To get a prompt send a message formatted like this: `!prompt {category}`. Acceptable categories are: characters, animals, situations, objects.');
    }
  }
});

client.login(token);