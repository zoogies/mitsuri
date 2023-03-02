const { SlashCommandBuilder } = require('discord.js');
const moment = require("moment");
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
require("moment-duration-format");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Get the current version, changelog and ping of the bot'),
        async execute(interaction) {
            const pkg = require("../package.json")
            let notes = "";
            let releasedate = ""
            await axios.get('https://api.github.com/repos/yoyolick/mitsuri/releases/latest')
            .then(response => {
                const releaseNotes = response.data.body;
                releasedate = response.data.published_at;
                // Replace newlines with line breaks in Markdown syntax
                const formattedNotes = releaseNotes.replace(/\n/g, "\n\n");
    
                // Add bold formatting to headings
                const boldHeadings = formattedNotes.replace(/## (.*)/g, "**$1**");
    
                // Add italic formatting to links
                const italicLinks = boldHeadings.replace(/\[(.*)\]\((.*)\)/g, "_[$1]($2)_");
    
                notes = italicLinks;
            })
            .catch(error => {
                console.log(error);
            });
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

            const duration = moment.duration(interaction.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            const e = new EmbedBuilder()
                .setColor(0xf542d1)
                .setTitle(`build v${pkg.version}`)
                .setURL('https://github.com/yoyolick/mitsuri/releases/latest')
                .setAuthor({ name: 'Mitsuri', iconURL: 'https://media.discordapp.net/attachments/790703174746636328/1040057921947578408/tumblr_4ddb73070eb53c6a0b0dea43cc2781cd_c1cecc63_1280_cropped.png', url: 'https://github.com/yoyolick/mitsuri' })
                .setDescription(`Running on [zoogies.live](https://zoogies.live) for \`${duration}\``)
                .setThumbnail('https://media.discordapp.net/attachments/790703174746636328/1040057921947578408/tumblr_4ddb73070eb53c6a0b0dea43cc2781cd_c1cecc63_1280_cropped.png')
                .addFields(
                    { name: '**Changelog:**', value: `\n--------------\n${ notes }\n--------------\n`, inline:false },
                    { name: 'Web Socket Heartbeat', value: `\`${interaction.client.ws.ping} ms\``, inline: true },
                    { name: 'Round Trip Latency', value: `\`${sent.createdTimestamp - interaction.createdTimestamp} ms\``, inline: true },
                )
                //.setImage('https://wallpapercrafter.com/th800/138647-Kimetsu-no-Yaiba-anime-Mitsuri-Kanroji-cleavage-multicolored-hair-green-eyes-uniform-twintails-long-hair.jpg')
                .setTimestamp(Date.parse(releasedate))
                .setFooter({ text: 'Developed by Ryan Zmuda and Released', iconURL: 'https://zmuda.dev/static/media/portrait_square_min.8f9c645e6cf0a8f21934.jpeg' });

            
            
            const last = await interaction.editReply({embeds: [e]});
        },
};