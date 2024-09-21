const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

// holds a running state of last rankings, to provide updates on positions
let last_checked = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repboard')
        .setDescription('See a breakdown of server rep'),
    async execute(interaction) {
        await interaction.deferReply();

        const { pb, client } = require('../index.js'); // cannot sit on top level because of weird js fuckery

        const records = await pb.collection('usercache').getFullList({
            sort: '-rep',
        });

        try {
            // get all member id's in this server
            const guildId = interaction.guild.id;
            const guild = await client.guilds.fetch(guildId);
            const members = await guild.members.fetch();

            // Extract member IDs
            const memberIds = members.map(member => member.id);

            // Filter records to include only those whose uuid is in memberIds
            const filteredRecords = records.filter(record => memberIds.includes(record.uuid));

            // Sort the filtered records by rep
            const sortedRecords = filteredRecords.sort((a, b) => b.rep - a.rep);

            // Create a ranked list with position changes
            let rankedList;
            if (last_checked != null) {
                const lastCheckedMap = new Map(last_checked.map((record, index) => [record.uuid, index]));
                rankedList = sortedRecords.map((record, index) => {
                    const previousIndex = lastCheckedMap.get(record.uuid);
                    let change = '   ';
                    if (previousIndex !== undefined) {
                        if (previousIndex > index) {
                            change = '⬆️';
                        } else if (previousIndex < index) {
                            change = '🔻';
                        }
                    }
                    return `${index + 1}. ${change} <@${record.uuid}>: ${record.rep} rep`;
                }).join('\n');
            } else {
                rankedList = sortedRecords.map((record, index) => ` ${index + 1}. <@${record.uuid}>: ${record.rep} rep`).join('\n');
            }

            // Update last_checked with the current rankings
            last_checked = sortedRecords;

            // Create an embed
            const embed = new EmbedBuilder()
                .setTitle(`**🏆   ${guild.name}'s Reputation Leaderboard   🏆**`)
                .setDescription(rankedList)
                .setColor(0xf542d1);

            // Send the embed as a response
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching members:', error);
            await interaction.followUp('Failed to fetch members.');
        }
    },
};