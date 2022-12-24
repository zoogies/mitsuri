const { SlashCommandBuilder } = require('discord.js');

const askresponse = ['yes daddy 😍', '❤️', 'ewwwwwwww nooo 🤢', 'idkkk 😶','😈','idc 🥱','yes pweaaase 🥺','😉','https://c.tenor.com/SdsYv4vylh0AAAAC/dog-saying-no-no.gif','https://c.tenor.com/Pta1QQlnZZYAAAAC/ben-yes-yes.gif','https://c.tenor.com/01tnAz3pRFwAAAAC/ben-laughs-ben-laughing.gif','https://c.tenor.com/VfB8CeuNh-0AAAAC/dog-hang-up-the-call-ben-hang-up.gif']

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('Ask mitsuri a question and see what she says')
        .addStringOption(option =>
			option
				.setName('question')
                .setRequired(true)
				.setDescription('The question you are asking mitsuri')),
    async execute(interaction) {
		await interaction.reply("Q:   "+interaction.options.getString('question')+"\nA:   "+askresponse[Math.floor(Math.random()*askresponse.length)]);
	},
};