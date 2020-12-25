const fs = require("fs");
const emoji = require('../settings/embed.js');
const csv = require('csv-parser');
const stripBom= require('strip-bom-stream');
const sound_dir = "../res/sound/";
const catalogue_csv_dir  = "./data/catalogue.csv";

module.exports = {
	name: 'play',
	description: 'Streams H-voice. Hosts 20GB (Will be 120GB in near future) of H-voice sorted by circles. \n' +
		'May contain nsfw content but some stuff is pretty tame e.g. > \n' +
		'Try \`::play circle momoiro-code RJ141480 loop\` or \`::play key 8\`\n',
	aliases: [],
	min_args: 0,
	usage: "[random <<num=5>>] [curr] [cat(alogue)] [skip] [circle <<name>> <<code>> <<num=(all files)>> <<loop=false>>]",
	admin_only:false,
	execute(message,args,queue){
		if(!message.member.voice.channel)
			return message.reply("Enter a channel");
		message.client.settings.set(message.guild.id,[],"queue");
		if (args[0] === 'random') {
			return message.reply("WIP");
			// let num = 5;
			// if(args[1])	{
			// 	num = parseInt(args[1]);
			// }
			// if(isNaN(num) || num <= 0){
			// 	return message.reply('Invalid number');
			// }
			// const circles = fs.readdirSync(sound_dir);
			// shuffle(circles);
			// const playlists = fs.readdirSync(sound_dir + circles[0] + '/');
			// shuffle(playlists);
			// play_from_folders(message,num,queue,sound_dir + circles[0] + '/' + playlists[0] + '/');
		} else if (args[0] === 'curr'){
			if (!queue.get(message.guild.id) || queue.get(message.guild.id).songs.length === 0){
				return message.reply("Queue is empty");
			}
			message.reply(queue.get(message.guild.id).songs);
		} else if (args[0] === 'skip'){
			if (!queue.get(message.guild.id).songs[0])
				return message.reply('I\'m not playing anything now');
			let num = 1;
			if (args[1]){
				num = parseInt(args[1]);
				if (isNaN(num) || num <= 0)
					return message.reply('Invalid number');
			}
			num = Math.min(num,queue.get(message.guild.id).songs.length);
			const skipped = [];
			for (let i = 0; i < num; ++i)
				skipped.push(queue.get(message.guild.id).songs[i]);
			for(let i = 0; i < num-1;++i)
				queue.get(message.guild.id).songs.shift();
			message.reply(`Skipped ${skipped}`);
			queue.get(message.guild.id).connection.dispatcher.end();
		} else if (args[0] === 'circle'){
			if (!args[1]){
				return message.reply('Missing circle name');
			}
			if (!args[2]){
				return message.reply('Missing work name');
			}
			let num = -1;
			if (args[3]) {
				num = parseInt(args[2]);
				if (isNaN(num)){
					num = 5;
				} else if (num <= 0) {
					return message.reply("Invalid number");
				}
			} else
				num = 5;
			const circle = args[1], work = args[2];
			play_from_folders(message,num,queue,sound_dir + "voice/" + circle + '/' + work + '/',args[3] === 'loop' || args[4] === 'loop');
		}  else if (args[0] === 'cat'){
			return message.reply("https://spongiforma.github.io/Shirator-Discord-Bot/res/catalogue/site/Shirator-Listing.htm");
		} else if (args[0] === 'key'){
			if(!args[1])
				return message.reply('Missing key');
			if(isNaN(parseInt(args[1])))
				return message.reply('Invalid key');
			const key = parseInt(args[1]);
			if (key < 0)
				return message.reply('invalid key');
			const res = [];
			fs.createReadStream(catalogue_csv_dir)
				.pipe(stripBom())
				.pipe(csv())
				.on('data',(data) => res.push(data))
				.on('end',() =>{
					if (key >= res.length)
						return message.reply('Invalid key');
					play_from_folders(message,-1,queue,sound_dir+res[key].dir,args[2]==='loop' || args[3]==='loop');
				});
		}
	}
}

function play_from_folders(message,num,queue,dir,loop = false){
	const queueConstruct = {
		textChannel: message.channel,
		voiceChannel: message.member.voice.channel,
		connection: null,
		songs: [],
		playing: true,
	};
	message.member.voice.channel.join().then(connection => {
		queue.set(message.guild.id,queueConstruct);
		const soundFiles = fs.readdirSync(dir).filter(e => e.endsWith(".wav"));
		if (!soundFiles){
			return message.reply("File(s) not found");
		}
		// shuffle(soundFiles);
		if (num === -1)
			num = soundFiles.length;

		const queue_copy = [];
		for (let i = 0; i < Math.min(num,soundFiles.length); ++i){
			queueConstruct.songs.push(soundFiles[i]);
			queue_copy.push(soundFiles[i]);
		}
		queueConstruct.connection = connection;
		if (loop){
			play(connection,message,queueConstruct.songs,dir,true,queue_copy);
		} else
			play(connection,message,queueConstruct.songs, dir);
	});
}

function play(connection, message, queue, dir,loop = false, original_queue = []) {
	let dispatcher = connection.play(dir + queue[0], {
		filter:
			"audioonly"
	});
	dispatcher.on('error', console.error);
	dispatcher.on('finish', function () {
		queue.shift();
		if (queue[0]) play(connection, message,queue, dir,loop,original_queue);
		else {
			if (loop) {
				for (const song of original_queue) {
					queue.push(song);
				}
				play(connection, message, queue, dir, loop, original_queue);
			} else
				connection.disconnect();
		}
	});
}
function read_csv_to_array(){


}

function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}
