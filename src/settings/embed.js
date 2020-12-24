const Discord = require('discord.js');
module.exports = {
	 embed: new Discord.MessageEmbed()
		.setColor('#fc645c')
		// .setTitle('Shirator menu')
		// .setURL('https://discord.js.org/')
		// .setAuthor('Shirator', './res/logo.png')
		// .setDescription('Some description here')
		// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
		// .addFields(
		// 	{ name: 'Regular field title', value: 'Some value here' },
		// 	{ name: '\u200B', value: '\u200B' },
		// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
		// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
		// )
		// .addField('Inline field title', 'Some value here', true)
		// .setImage('https://i.imgur.com/wSTFkRM.png')
		.setTimestamp()
		.setFooter('If I cannot join them, I will rise above them; and if I cannot rise above them, I will destroy them'),
	// .setFooter('"Itty bitty witty chen cute kawaii sugoi haha" - MacGyver');
	numbers: ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'],
	cross:'❌',
	left: '⬅️',
	right: '➡️'
}
