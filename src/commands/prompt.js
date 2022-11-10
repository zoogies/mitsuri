const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prompt')
		.setDescription('Sends a random art prompt')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of prompt you want to recieve')
                .setRequired(true)
				.addChoices(
					{ name: 'Characters', value: 'characters' },
                    { name: 'Animals', value: 'animals' },
                    { name: 'Situations', value: 'situations' },
                    { name: 'Objects', value: 'objects' },
				)),
	async execute(interaction) {
            const prompt = await axios.post('https://artsideoflife.com/api/read.php',"category="+interaction.options.getString('type'));
            try{
                await interaction.reply(prompt.data);
            }
            catch{
                await interaction.reply("Something went wrong!");
            }
	},
};