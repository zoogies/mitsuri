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
		.setName('action')
		.setDescription('Perform an action on somebody else')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of action you want to perform')
                .setRequired(true)
                .addChoices(
                    { name: 'Hug', value: 'hug' },
                    { name: 'Kiss', value: 'kiss' },
                    { name: 'Dap', value: 'dap' },
                    { name: 'Greet', value: 'greet' },
                ))
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to act upon')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if(interaction.options.getUser('target')){
            switch (interaction.options.getString("type")) {
                case "hug":
                    await interaction.reply('<@'+interaction.user+'> hugs <@'+user+'>     https://tenor.com/view/hug-k-on-anime-cuddle-gif-16095203');
                    break;
                case "kiss":
                    await interaction.reply('<@'+interaction.user+'> kisses <@'+user+'>     '+kissgifs[Math.floor(Math.random()*kissgifs.length)]);
                    break;
                case "dap":
                    await interaction.reply('<@'+interaction.user+'> daps <@'+user+'> up     https://tenor.com/view/bornskywalker-dap-me-up-woody-woody-handshake-woody-toy-story-gif-26021440');
                    break;
                case "greet":
                    await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️ <@'+user+'>     https://media.tenor.com/KX-URy7fC6oAAAAd/mitsuri-kanroji.gif');
                    break;
                default:
                    await interaction.reply("Something went wrong. Please try again later.");
                    break;
            }
		}
        else {
			switch (interaction.options.getString("type")) {
                case "hug":
                    await interaction.reply('https://tenor.com/view/hug-k-on-anime-cuddle-gif-16095203');
                    break;
                case "kiss":
                    await interaction.reply(kissgifs[Math.floor(Math.random()*kissgifs.length)]);
                    break;
                case "dap":
                    await interaction.reply('https://tenor.com/view/bornskywalker-dap-me-up-woody-woody-handshake-woody-toy-story-gif-26021440');
                    break;
                case "greet":
                    await interaction.reply('Hiiiiii!!! ❤️❤️❤️❤️❤️❤️     https://media.tenor.com/KX-URy7fC6oAAAAd/mitsuri-kanroji.gif');
                    break;
                default:
                    await interaction.reply("Something went wrong. Please try again later.");
                    break;
            }
		}
	},
};
