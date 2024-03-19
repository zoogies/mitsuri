const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('version')
		.setDescription('Get the version number the current build of mitsuri is running (semver)'),
    async execute(interaction) {
        const pkg = require("../package.json")
		await interaction.reply("**Currently running:** build v"+pkg.version+"\n[**>> see what\'s new**](<https://github.com/zoogies/mitsuri/releases>)");
	},
};