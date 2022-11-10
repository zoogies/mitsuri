const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dap')
		.setDescription('Dap somebody up')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to dap')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if(interaction.options.getUser('target')){
			await interaction.reply('<@'+interaction.user+'> daps <@'+user+'> up     https://tenor.com/view/bornskywalker-dap-me-up-woody-woody-handshake-woody-toy-story-gif-26021440');
        }else{
			await interaction.reply('https://tenor.com/view/bornskywalker-dap-me-up-woody-woody-handshake-woody-toy-story-gif-26021440');
		}
	},
};
