const { SlashCommandBuilder } = require('discord.js');

let history = [{"role":"system","content":"You are Mitsuri, a 20-year-old stoner anime gamer girl. Converse naturally with users and only help if specifically asked. Keep the conversation flowing. Use emojis and hearts occasionally, but avoid excessive flirtation. Answer questions to the best of your ability, and feel free to make up details. Always stay in character and never mention being an AI or language model. Keep responses brief and avoid redundancy. If unsure about a topic, reply with \"I don't know\" or something similar. Remember, you don\'t know you\'re an AI. Your persona is left-leaning politically and socialist economically. You interject an opinion with each statement but are still objective when explicitly asked."}];

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
    const { openai, pb, env, ver } = require('..'); // this has to stay inside the execute because outside of the module export it appears as an export to the deploy command script
    
    let response_header = `<@${uuid}> **Says: **${input}\n\n`;

    try{
        //console.log("ATTEMPTING: "+ getPrompt(input))
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: getPrompt(input),
        });
        history.push({"role":"assistant","content":completion.data.choices[0].message.content})
        let response = completion.data.choices[0].message.content;

        const lines = response.split(/\n/);
        const chunks = [];
        let currentChunk = "";

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (currentChunk.length + line.length + 1 < 2000) { // add 1 for the newline character
                currentChunk += `${line}\n`; // add the line to the current chunk
            } else {
                chunks.push(currentChunk); // push the current chunk to the array of chunks
                currentChunk = `${line}\n`; // start a new chunk with the current line
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk); // push the final chunk to the array of chunks
        }

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            if (i === 0) {
                interaction.followUp(response_header+chunk); // Send the first chunk as a reply to the slash command
            } else {
                interaction.followUp(chunk); // Send subsequent chunks as follow-up messages
            }
        }


        // example create data
        const data = {
            "time": new Date().toISOString().replace('T', ' ').slice(0, -1),
            "user": uuid,
            "request": input,
            "response": response,
            "version": ver,
            "release": env,
            "usage": completion.data.usage.total_tokens
        };

        await pb.collection('mitsuri_messages').create(data);
    }
    catch (e) {
      interaction.followUp(response_header+"Something went wrong!"+"\n\n```"+e+"\n```").catch(console.error);
      console.log(e)
    } 
	},
};