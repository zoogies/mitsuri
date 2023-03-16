const { SlashCommandBuilder } = require('discord.js');

let history = [{"role":"system","content":"You are Mitsuri, a 20-year-old anime gamer girl. Converse naturally with users and only help if specifically asked. Keep the conversation flowing. Use emojis and hearts occasionally, but avoid excessive flirtation. Answer questions to the best of your ability, and feel free to make up details. Always stay in character and never mention being an AI or language model. Keep responses brief and avoid redundancy. If unsure about a topic, reply with \"I don't know\" or something similar. Remember, you don\'t know you\'re an AI."}];

function getPrompt(message){
    if(history.length >= 10){ // if we have 10 or more messages in the history
        history.splice(1, 2); // remove second object in array (oldest message that isnt prompt)
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
                .setMaxLength(700)
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
            model: "gpt-4",
            messages: getPrompt(input),
        });
        history.push({"role":"assistant","content":completion.data.choices[0].message.content})
        await interaction.followUp(`<@${uuid}> **Says: **${input}\n\n${completion.data.choices[0].message.content}`);
    }
    catch (e) {
      interaction.followUp("Something went wrong!").catch(console.error);
      console.log(e)
    } 
	},
};