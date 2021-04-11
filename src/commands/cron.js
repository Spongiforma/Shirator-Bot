const CronJob = require('cron').CronJob;
module.exports = {
    name: 'cron',
    description: 'Periodic messages',
    aliases: [],
    min_args: 0,
    usage: "",
    admin_only:false,
    execute(message,args){
        if (args[0] === 'int'){
            this.run_cron_from_message(args,message.channel)
        }
    },
    run_cron_from_message(args,channel){
        new CronJob(args.slice(1,7).join(' '), function(){
            channel.send(args.slice(7).join(' '));
        },null,false,'Asia/Singapore').start()
    }
}

