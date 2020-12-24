module.exports = {
    name: 'prefix',
    description: 'sets prefix!',
    aliases: [],
    min_args: 1,
    usage: "[new_prefix]",
    admin_only: true,
    execute(message,args){
        const {disabled_prefixes,old_prefix} = message.client.settings.get(message.guild.id);
        if (!args.length){
            return message.reply("You're missing an argument");
        }

        const new_prefix = args[0].toLowerCase();

        if (disabled_prefixes.includes(new_prefix)){
            return message.reply("That prefix is disabled");
        }
        message.client.settings.set(message.guild.id, new_prefix, "prefix",);
        message.reply(`Prefix has been changed from \`${old_prefix}\` to \`${new_prefix}\``);
    }
}
