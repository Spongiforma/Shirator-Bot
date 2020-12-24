module.exports = {
	name: 'ping',
	description: 'Ping!',
	aliases: [],
	min_args: 0,
	usage: "",
	admin_only:false,
	execute(message,args){
		// Likely inaccurate
		message.channel.send(`Pong. - Time taken: ${(new Date().getTime() - message.createdTimestamp)} ms`);
	}
}