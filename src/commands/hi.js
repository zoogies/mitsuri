const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hi')
		.setDescription('Sends a greeting'),
	async execute(interaction) {
		await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️');
	},
};
