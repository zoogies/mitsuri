const { SlashCommandBuilder } = require('discord.js');

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
        const { getResponse, performDatabaseOperation } = require('../mitsuri.js'); // NOTE: has to be in here, fuck slash command builder

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
            const completion = await getResponse(uuid,input,"gpt-3.5-turbo"); // TODO: allow user to specify model, TODO: update leaderboard to reflect this mixing of gpt3 tokens
            let response = response_header + completion;

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
                    interaction.followUp(chunk); // Send the first chunk as a reply to the slash command
                } else {
                    interaction.followUp(chunk); // Send subsequent chunks as follow-up messages
                }
            }
        }
        catch (e) {
        interaction.followUp(response_header+"Something went wrong!"+"\n\n```"+e+"\n```").catch(console.error);
        console.log(e)
        }
	},
};