const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('Hug somebody')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to hug')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if(interaction.options.getUser('target')){
			await interaction.reply('<@'+interaction.user+'> hugs <@'+user+'>     https://tenor.com/view/hug-k-on-anime-cuddle-gif-16095203');
        }else{
			await interaction.reply('https://tenor.com/view/hug-k-on-anime-cuddle-gif-16095203');
		}
	},
};