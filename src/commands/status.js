const { SlashCommandBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get the current version, changelog and ping of the bot'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const duration = moment.duration(interaction.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const pkg = require("../package.json")
        interaction.editReply(`**Currently running:** \`build v`+pkg.version+`\`\n>> **Uptime:** \`${duration}\`\n**>> WSHB: **\`${interaction.client.ws.ping}ms\`\n**>> RTL: **\`${sent.createdTimestamp - interaction.createdTimestamp}ms\`\n\n**Changelog:**\n[**>> take me there**](<https://github.com/Yoyolick/mitsuri/releases>)\n`);
	},
};