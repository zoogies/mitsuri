const { SlashCommandBuilder } = require('discord.js');

const { pb } = require('../index.js');

async function get_uuid_rep(uuid) {
	const resultList = await pb.collection('usercache').getList(1, 1, {
		filter: `uuid="${uuid}"`,
	});

	// if there is no item, create it with rep 1
	if(resultList.items.length == 0){
		await pb.collection('usercache').create({uuid: uuid, rep: 0});
		return 0;
	}
    return resultList.items[0].rep;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rep')
		.setDescription('Check you or somebody else\'s rep')
        .addUserOption(option =>
            option
                .setRequired(false)
                .setName('target')
                .setDescription('The member to check')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
        if(interaction.options.getUser('target')){
            const uuid = user.id;
            const rep = await get_uuid_rep(uuid);
            await interaction.reply(`**<@${uuid}>** has ${rep} rep ✨`);
        }
        else {
            const uuid = interaction.user.id;
            const rep = await get_uuid_rep(uuid);
            await interaction.reply(`<@${interaction.user.id}> has ${rep} rep ✨`);
        }
    },
};
