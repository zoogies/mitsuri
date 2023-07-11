const { SlashCommandBuilder } = require('discord.js');
const elevenLabsAPI = require('elevenlabs-node');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('facetime')
		.setDescription('Facetime with mitsuri (conversational)')
        .addStringOption(option =>
            option
                .setName('input')
                .setRequired(true)
                .setMaxLength(150)
                .setDescription('What you want to say to mitsuri')),
	async execute(interaction) {
    const { getResponse, performDatabaseOperation } = require('../mitsuri.js'); // NOTE: has to be in here, fuck slash command builder

    const uuid = interaction.user.id;
    const input = interaction.options.getString("input");

    if (input == null) {
      await interaction.reply("You cant talk about empty things.");
    }
    else{

    await interaction.deferReply(); // tell discord we have acknowledged but need some time to finish this reply

    const { openai, pb, env, ver, elevenTOKEN } = require('..'); // this has to stay inside the execute because outside of the module export it appears as an export to the deploy command script
    
    let response_header = `<@${uuid}> **Says: **${input}\n\n`;
    //console.log("ATTEMPTING: "+ getPrompt(input))
    interaction.followUp("Thinking...").catch(console.error);
    const completion = await getResponse(uuid,input,"gpt-3.5-turbo"); // TODO: allow user to specify model, TODO: update leaderboard to reflect this mixing of gpt3 tokens
    // TODO add max character response

    const apiKey = elevenTOKEN;                 // Your API key from Elevenlabs
    const voiceID = 'qOP31a8Izheugwuj4Za1';     // The ID of the voice you want to get
    const fileName = './staging/output.mp3';    // The name of your audio file
    const textInput = completion; // The text you wish to convert to speech
    
    interaction.editReply("Speaking...").catch(console.error);
    
    const writeToFile = new Promise((resolve, reject) => {
        elevenLabsAPI.textToSpeechStream(apiKey, voiceID, textInput)
          .then((res) => {
            const fileStream = fs.createWriteStream(fileName);
            res.pipe(fileStream);
    
            fileStream.on("finish", () => {
              // console.log('File written!');
              resolve();
            });
    
            fileStream.on("error", (error) => {
              console.error('Error writing file:', error);
              reject(error);
            });
          })
          .catch((error) => {
            console.error('Error in API call:', error);
            reject(error);
          });
      });
    
      try {
        await writeToFile;
        const audioData = await fs.promises.readFile(fileName);
        interaction.editReply({ content: response_header, files: [{ attachment: audioData, name: 'output.mp3' }] });
      } catch (error) {
        console.error('Error in file processing:', error);
        interaction.editReply("An error occurred while generating the audio.");
      }

    }
    },
};