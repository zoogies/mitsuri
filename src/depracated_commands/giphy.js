// IDEAS:
// button on bottom to regen for random

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giphy')
		.setDescription('GIPHY API interface, used for gifs and other media')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of media sent, defaults to gif')
                .setRequired(false)
				.addChoices(
					{ name: 'Gif', value: 'gifs' },
                    { name: 'Sticker', value: 'stickers' },
				))
        .addStringOption(option =>
            option.setName('endpoint')
                .setDescription('The type of search request you want to make, defaults to random')
                .setRequired(false)
				.addChoices(
					{ name: 'Random', value: 'random' },
				))
        .addStringOption(option =>
            option.setName('rating')
                .setDescription('The explicitivity of the result, defaults to rated R')
                .setRequired(false)
                .addChoices(
                    { name: 'G', value: 'g' },
                    { name: 'PG', value: 'pg' },
                    { name: 'PG-13', value: 'pg-13' },
                    { name: 'R', value: 'r' },
                ))
        .addStringOption(option =>
            option
                .setName('tag')
                .setRequired(false)
                .setMaxLength(50)
                .setDescription('An optional text tag for the search')),
	async execute(interaction) {
        const { giphy_key } = require('..');

        // default type to gifs
        let type = interaction.options.getString('type') ? interaction.options.getString('type') : 'gifs';

        // default endpoint to random
        let endpoint = interaction.options.getString('endpoint') ? interaction.options.getString('endpoint') : 'random';

        // default rating to r
        let rating = interaction.options.getString('rating') ? interaction.options.getString('rating') : 'r';

        // default tag to nothing
        let tag = interaction.options.getString('tag') ? interaction.options.getString('tag').replace(' ','+') : '';

        // build url
        let url = `https://api.giphy.com/v1/${type}/${endpoint}?api_key=${giphy_key}&tag=${tag}&rating=${rating}`

		const result = await axios.get(url).then(function(response){
            interaction.reply(response.data['data']['embed_url']);
        }).catch(function(error){
            switch (error.response.status) {
                case 400:
                    interaction.reply("Your request was formatted incorrectly or missing a required parameter(s).");
                    break;
                case 401:
                    interaction.reply("Your request lacks valid authentication credentials for the target resource.");
                    break;
                case 403:
                    interaction.reply("You aren't authorized to make this request.");
                    break;
                case 404:
                    interaction.reply("The particular GIF or Sticker you are requesting was not found.");
                    break;
                case 414:
                    interaction.reply("The length of the search query cannot exceed 50 characters.");
                    break;
                case 429:
                    interaction.reply("Too many requests, try again later.");
                    break;
                default:
                    interaction.reply("Something went wrong. Please try again later.");
                    break;
            }
        });
	},
};