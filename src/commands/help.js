module.exports = {
	name: 'help',
	description: 'List command info',
	aliases: ['commands'],
	min_args: 0,
	usage: '[command_name]',
	admin_only: false,
	execute(message,args){
		const {prefix} = message.client.settings.get(message.guild.id);
		const data = [];
		const {commands} = message.client;
		if(!args.length){
			data.push('List of commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
				});
		} else{
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.include(name));

			if(!command){
				return message.reply('that\'s not a valid command');
			}
			data.push(`**Name:** ${command.name}`);
			if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** \`${message.client.settings.get(message.guild.id,"prefix")}${command.name} ${command.usage}\``);

			// data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

			message.channel.send(data, { split: true });
		}
	}
}