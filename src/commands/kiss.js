const { SlashCommandBuilder } = require('discord.js');

const kissgifs = [
    "https://tenor.com/view/kiss-anime-girls-gif-26533004",
    "https://tenor.com/view/girl-anime-kiss-anime-i-love-you-girl-kiss-gif-14375361",
    "https://tenor.com/view/gay-kiss-gif-16073834",
    "https://tenor.com/view/test-gif-25730394",
    "https://tenor.com/view/girl-kiss-lewd-gif-15240821",
    "https://tenor.com/view/kiss-yuri-anime-sakura-sakura-kiss-gif-15111552",
    "https://tenor.com/view/girl-anime-kiss-anime-i-love-you-girl-kiss-gif-14375357",
    "https://tenor.com/view/girls-lesbian-kissing-anime-kiss-gif-17722209",
    "https://tenor.com/view/cat-kiss-gif-25376137"
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Kiss a homie')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to kiss')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if(interaction.options.getUser('target')){
			await interaction.reply('<@'+interaction.user+'> kisses <@'+user+'>     '+kissgifs[Math.floor(Math.random()*kissgifs.length)]);
        }else{
			await interaction.reply(kissgifs[Math.floor(Math.random()*kissgifs.length)]);
		}
	},
};