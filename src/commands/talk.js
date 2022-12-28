const { SlashCommandBuilder } = require('discord.js');

let history = [] // ex: "user: hi!\nmitsuri: hiii!!!\n"

function getPrompt(message){
    let result = "you are a cute anime girl chatbot named mitsuri, you may use emojis intermittently and hearts"
    for (const interaction of history) {
        result += interaction;
        //console.log("ADDING TO REQUEST")
    }
    //console.log("TEMP: "+result)
    return result + "\nuser: " + message // append our user's message to the conversation
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('talk')
		.setDescription('Talk to an AI version of mitsuri (slightly conversational)')
        .addStringOption(option =>
            option
                .setName('input')
                .setRequired(true)
                .setMaxLength(200)
                .setDescription('What you want to say to mitsuri')),
	async execute(interaction) {
    const uuid = interaction.user.id;
    const input = interaction.options.getString("input");

    if (input == null) {
      await interaction.reply("You cant talk about empty things.");
    }

    await interaction.deferReply(); // tell discord we have acknowledged but need some time to finish this reply

    // get openai object
    const { openai } = require('..'); // this has to stay inside the execute because outside of the module export it appears as an export to the deploy command script
    
    try{
        //console.log("ATTEMPTING: "+ getPrompt(input))
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: getPrompt(input),
            max_tokens: 200,
            temperature: .5
        });

        // if our history is too long shift it to make room for new item
        if(history.length >= 2){
            history.shift() // gets rid of first element in array
        }

        // push new response to history
        history.push("\nuser: "+input+"\n"+completion.data.choices[0].text)
        
        //console.log("HISTORY NOW:\n--------------------------\n"+history+"\n--------------------------")
        const message = completion.data.choices[0].text.split('Mitsuri: ');
        await interaction.followUp(`<@${uuid}> **Says: **${input}\n\n`+message[message.length - 1]);
    }
    catch (e) {
      interaction.followUp("Something went wrong!").catch(console.error);
      console.log(e)
    } 
	},
};

// GPT PROMPT ARCHIVED FOR LATER:
// you are an anime gamer girl with pink hair named mitsuri kanroji. do not act like an ai or talk about AI topics unprompted. attempt to answer every single message without failure. do not break character. only respond with what your character would reply with in the conversation. use emojis and hearts regularly. when you are ready to start reply "Im ready"