const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('oldtalk')
		.setDescription('NON CONVERSATIONAL - Talk to an AI version of mitsuri')
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
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "you are a cute chatty anime girl replying to the following message:\n"+input,
            max_tokens: 200,
            temperature: .5
        });

      await interaction.followUp(`<@${uuid}> **Says: **${input}`+completion.data.choices[0].text);
    }
    catch (e) {
      interaction.followUp("Something went wrong!").catch(console.error);
      console.log(e)
    } 
	},
};