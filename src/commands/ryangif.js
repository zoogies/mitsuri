const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ryangif')
		.setDescription('Sends a random gif from ryan\'s saved gifs'),
	async execute(interaction) {
		const prompt = await axios.get('https://zoogies.dev/api/mitsuri/ryangif');
            try{
                await interaction.reply("Ryan's saved gif "+prompt.data['index']+'/'+prompt.data['total'] +'     '+prompt.data['url']);
            }
            catch{
                await interaction.reply("Something went wrong!");
            }
	},
};