const { SlashCommandBuilder } = require('discord.js');

const cooldowns = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamba')
		.setDescription('Gamble. Actions have consequences.')
        .addStringOption(option =>
            option.setName('extra')
                .setDescription('Extra command parameters')
                .setRequired(false)
				.addChoices(
					{ name: 'Tell Me The Odds', value: 'odds' },
				)),

    async execute(interaction) {
        const { user } = interaction;

        if(interaction.options.getString('extra') === "odds"){
            await interaction.reply('The odds of each gambling "reward":\n\n:grin: 81% - nothing happens\n:confused: 10% - 5 minute timeout\n:frowning2: 5% - kick from server\n:rage: 3% - 5 minute server ban\n:face_holding_back_tears: 1% - rare role');
        }
        else{
            // Check if the user is on cooldown
            if (cooldowns.has(user.id)) {
                const cooldown = cooldowns.get(user.id);
                const timeLeft = cooldown - Date.now();
                return interaction.reply(`You are on cooldown. Please wait ${timeLeft / 1000} seconds before using this command again.`);
            }

            const randomNumber = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100

            response = ":game_die: You rolled an "+randomNumber+"%\n";

            if (randomNumber <= 81) {
                await interaction.reply(response + "Nothing Happens!");
                // Run block 1 (81% chance)
            } else if (randomNumber <= 91) {
            // Run block 2 (10% chance)
                await interaction.options.getUser(interaction.user).timeout(300_000);
                await interaction.reply(response + "You get a 5 minute timeout!");
            } else if (randomNumber <= 96) {
            // Run block 3 (5% chance)
                await interaction.options.getUser(interaction.user).kick(); // Replace with the ID of the role to add
                interaction.reply(response + "You get kicked!");
            } else if (randomNumber <= 99) {
            // Run block 4 (3% chance)
                interaction.guild.members.ban(interaction.options.getUser(interaction.user));
                interaction.reply(response + "You get a 5 minute ban!");
        
                setTimeout(() => {
                    interaction.guild.members.unban(interaction.options.getUser(interaction.user));
                }, 5 * 60 * 1000); // Delay the function by 5 minutes (5 minutes * 60 seconds * 1000 milliseconds)
            } else {
            // Run block 5 (1% chance)
                await member.roles.add('1079601188451917854'); // Replace with the ID of the role to add
                interaction.reply(response + "You get a rare role!");
            }
            
            if (interaction.user.id === '245317187135471616') {
                // pass, no cooldown for the pog dev man
              } else {
                const cooldownTime = 5 * 60 * 1000; // 5 minutes
                cooldowns.set(user.id, Date.now() + cooldownTime);
                // Remove the user from the cooldowns collection after the cooldown ends
                setTimeout(() => cooldowns.delete(user.id), cooldownTime);
              }
        }
	},
};