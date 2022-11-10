const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sends the current websocket ping')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Ping type selection')
                .setRequired(true)
				.addChoices(
					{ name: 'Heartbeat', value: 'heart' },
                    { name: 'Roundtrip', value: 'round' },
				)),
	async execute(interaction) {
        type = interaction.options.getString('type')
        if(type == 'heart'){
            await interaction.reply(`🥰 Websocket heartbeat: ${interaction.client.ws.ping}ms 🥰`);
        }
		else{
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
            interaction.editReply(`🥰 Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms 🥰`);
        }
	},
};