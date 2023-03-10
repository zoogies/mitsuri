// imports
const fs = require('node:fs');
const Handlebars = require('handlebars');

// create list to hold each command
const commands = [];

// Grab all the command files from the commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for doc generation
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Compile the Handlebars template
const template = Handlebars.compile(fs.readFileSync('../README-TEMPLATE.hbs', 'utf8'));

// Render the template with the data
const readme = template({ commands });

// Write the generated README.md file to disk
fs.writeFileSync('../README.md', readme);

try{
	console.log(`>> Wrote docs for ${commands.length} application commands into README.md`)
} catch (error) {
	console.error(error);
}