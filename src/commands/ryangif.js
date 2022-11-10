const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ryangif')
		.setDescription('Sends a random gif from ryan\'s saved gifs'),
	async execute(interaction) {
		await interaction.reply('Unfortunately, this function is still in the process of being ported.');
	},
};