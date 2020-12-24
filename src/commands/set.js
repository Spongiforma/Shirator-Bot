module.exports = {
	name: 'prop',
	description: 'Prints bot settings',
	aliases: ['setf','setq'],
	min_args: 0,
	usage: "[] [property] [property new_value]",
	admin_only: true,
	execute(message,args){
		const guildConf = message.client.settings.get(message.guild.id);
		if(!args.length){
			const data = ['\n'];
			for (const prop_name of guildConf.settings){
				data.push(`**${prop_name}**: \`${guildConf[prop_name]}\``);
			}
			message.reply(data,{split: true});
		} else {
			const prop_name = args[0].toLowerCase();
			if (guildConf[prop_name]){
				message.reply(`**${prop_name}**: \`${guildConf[prop_name]}\``);
			} else {
				message.reply('That property does not exist');
			}
		}
	}
}
