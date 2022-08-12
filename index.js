// Require the necessary discord.js classes
const { Client, Intents, MessageFlags } = require('discord.js');
// const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const { token } = require('./config.json');
//const config = require('./rpc.json');
const axios = require('axios');
//const DiscordRPC = require('discord-rpc');
//const RPC = new DiscordRPC.Client({transport:'ipc'});
//DiscordRPC.register(config.ClientID);
const giffile = require('./gifs.json');
const gifs = giffile['gifs'];

const prefix = "!prompt"
const options = ['characters','animals','situations','objects']
const askresponse = ['yes daddy 😍', 'ewwwwwwww nooo 🤢', 'idkkk 😶','😈','idc 🥱','yes pweaaase 🥺','😉','https://c.tenor.com/SdsYv4vylh0AAAAC/dog-saying-no-no.gif','https://c.tenor.com/Pta1QQlnZZYAAAAC/ben-yes-yes.gif','https://c.tenor.com/01tnAz3pRFwAAAAC/ben-laughs-ben-laughing.gif','https://c.tenor.com/VfB8CeuNh-0AAAAC/dog-hang-up-the-call-ben-hang-up.gif']
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
  console.log("Art Prompt Bot v8.12.22 >> Ryan Zmuda");
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
  else if(message.content.startsWith('!ask')){
    message.channel.send(askresponse[Math.floor(Math.random()*askresponse.length)]);
  }
  else if(message.content.startsWith('!ryangif')){
    var gifnum = Math.floor(Math.random()*gifs.length);
    message.channel.send('ryans saved gif #'+gifnum+' '+gifs[gifnum]['url']);
  }
  // else if(message.content.startsWith('!dalle')){ //IN PROGRESS BOOLEAN AND QUEUE TODO
  //   message.channel.send(args.join(' '));
  //   (async function example() {
  //     let driver = new Builder().forBrowser(Browser.CHROME).build();
  //     try {
  //       await driver.get("https://www.craiyon.com/");
  //       await driver.findElement(By.id('prompt')).sendKeys(args.join(' '), Key.RETURN);
  //       //TODO NEED CHECK FOR TOO MUCH TRAFFIC OR JUST A GENERAL TIMEOUT
  //       //TODO HONESTLY JUST ADD A TIMEOUT THING RIGHT HERE FOR THIS WHOLE FUNCTION
  //       await driver.wait(until.elementLocated(By.className('grid-cols-3')), 200000);
  //       //await driver.findElement(By.css("[aria-label=Screenshot]")).click;
  //       var images = driver.findElements(By.className('aspect-w-1 aspect-h-1'))
  //           for(image in images){
  //             console.log(image, typeof image)
  //             console.log(image.findElement(By.className('border-gray-500')).getAttribute("src"));
  //           }
        
  //       //ok so basically the plan is to scrape the base64 from every single element and combine
  //       //if this isnt cross platform i will lose it


  //       //await driver.findElement(By.className('grid-cols-3')).getSize().then(function(size) {
  //       //await console.log(await driver.takeScreenshot());
  //       await driver.sleep(5000);

  //       await driver.quit();
  //       message.channel.send("done!");

  //     } catch (e) {
  //       console.log("Error Occured:", e);
  //       message.channel.send("A problem occurred processing a dalle request.");
  //     }
  //   })();
  // }
});

client.login(token);


//possibly just rewrite this whole mf in python with a server that syncs saved gifs