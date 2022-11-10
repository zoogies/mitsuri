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
			await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️ <@'+user+'>     https://www.icegif.com/wp-content/uploads/2022/03/icegif-1249.gif');
		}else{
			await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️     https://www.icegif.com/wp-content/uploads/2022/03/icegif-1249.gif');
		}
	},
};
