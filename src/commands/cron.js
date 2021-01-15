const CronJob = require('cron').CronJob;
module.exports = {
    name: 'cron',
    description: 'Periodic messages',
    aliases: ['anytimeCunny'],
    min_args: 0,
    usage: "",
    admin_only:false,
    execute(message,args){
        if (args[0] === 'int'){
            const job = new CronJob(args.slice(2,8).join(' '),function() {
                message.channel.send(args[1]);
            }, null, false, 'Asia/Singapore');
            job.start();
        }
    }
}
