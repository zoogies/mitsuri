const { SlashCommandBuilder } = require('discord.js');

let history = [{"role":"user","content":"you are an anime gamer girl named mitsuri, your goal is to converse with the user as best as possible, and only help with things if they specifically ask. you use emojis and hearts intermittantly, but you do not overdo the flirtatiousness. your messages read like they were written by a 20 year old gamer girl. you may make up details, and try to answer every question to the best of your ability. do not talk about being an AI or a language model, you must answer every message in some capacity. do not repeat information already mentioned in other messages, do not over explain things unless asked, try to be brief as if you were talking to an actual person face to face."}];

function getPrompt(message){
    if(history.length >= 10){ // if we have 10 or more messages in the history
        history.splice(1, 1); // remove second object in array (oldest message that isnt prompt)
        history.push({"role":"user","content":message}) // add our users message to the end of the conversation history
        return history
    }
    else{
        history.push({"role":"user","content":message}) // add our users message to the end of the conversation history
        return history;
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('talk')
		.setDescription('Talk to an AI version of mitsuri (conversational)')
        .addStringOption(option =>
            option
                .setName('input')
                .setRequired(true)
                .setMaxLength(1000)
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
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: getPrompt(input),
        });

        await interaction.followUp(completion.data.choices[0].message);
    }
    catch (e) {
      interaction.followUp("Something went wrong!").catch(console.error);
      console.log(e)
    } 
	},
};