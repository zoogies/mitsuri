const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('greet')
		.setDescription('Sends a greeting')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to greet')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if(interaction.options.getUser('target')){
			await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️ <@'+user+'>     https://media.tenor.com/KX-URy7fC6oAAAAd/mitsuri-kanroji.gif');
		}else{
			await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️     https://media.tenor.com/KX-URy7fC6oAAAAd/mitsuri-kanroji.gif');
		}
	},
};
