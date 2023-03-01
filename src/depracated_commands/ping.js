const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sends the current websocket ping'),
	async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.editReply(`**>>** Websocket heartbeat: **${interaction.client.ws.ping}ms**\n**>>** Roundtrip latency: **${sent.createdTimestamp - interaction.createdTimestamp}ms**`);
    }
};