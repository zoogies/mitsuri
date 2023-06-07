const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show a leaderboard of the top token spenders'),
    async execute(interaction) {
        const { pb } = require('..');

        await interaction.reply({ content: 'Fetching...', fetchReply: true });

        const records = await pb.collection('mitsuri_messages').getFullList({
            sort: '-created',
        });

        const userUsageMap = new Map();

        records.forEach(record => {
            const userId = record.user;
            const usage = record.usage;

            if (userUsageMap.has(userId)) {
                userUsageMap.set(userId, userUsageMap.get(userId) + usage);
            } else {
                userUsageMap.set(userId, usage);
            }
        });

        const userUsageList = Array.from(userUsageMap.entries())
            .map(([user, usage]) => ({ user, usage }))
            .sort((a, b) => b.usage - a.usage);

        let ranking = '';
        const costPer1000Tokens = 0.03;
        let totalTokens = 0;

        userUsageList.forEach((userUsage, index) => {
            totalTokens += userUsage.usage;
            const userSpent = (userUsage.usage / 1000) * costPer1000Tokens;
            ranking += `${index + 1}. <@${userUsage.user}>: ${numberWithCommas(userUsage.usage)} tokens (**$${userSpent.toFixed(2)}**)\n`;
        });

        const totalUsage = `${totalTokens} tokens (**$${(totalTokens / 1000 * costPer1000Tokens).toFixed(2)}**)\nRoughly **${totalTokens * .75} words!**`; // .75 is magic number of words per token

        // TODO FIXME: if there is ever 25 unique users this function will break LMAO
        const embed = new EmbedBuilder()
            .setColor(0xf542d1)
            .setTitle(`Token Usage Leaderboard`)
            .setAuthor({ name: 'Mitsuri', iconURL: 'https://media.discordapp.net/attachments/790703174746636328/1040057921947578408/tumblr_4ddb73070eb53c6a0b0dea43cc2781cd_c1cecc63_1280_cropped.png', url: 'https://github.com/yoyolick/mitsuri' })
            .setDescription(`Top drainers of Ryan's wallet`)
            .setThumbnail('https://media.discordapp.net/attachments/790703174746636328/1040057921947578408/tumblr_4ddb73070eb53c6a0b0dea43cc2781cd_c1cecc63_1280_cropped.png')
            .addFields(
                { name: 'Token Usage Ranking', value: ranking },
                { name: 'Total Usage', value: numberWithCommas(totalUsage) },
            )

        await interaction.editReply({ content: '', embeds: [embed] });
    },
};