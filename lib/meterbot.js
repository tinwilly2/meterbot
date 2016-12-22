var SlackBot = require('slackbots');
var bot = new SlackBot({
    token: 'xoxb-116821618144-OSWyE2AmEORzYFidyF29Aj0S', // put the token
    name: 'meterbot'
});

bot.on('start', function() {
    for(var i=0; i<this.users.length; i++){
        if(this.users[i].name == bot.name){
            this.user = this.users[i];
            break;
        }
    }
});

bot.on('message', function(data) {
   if(data.type === 'message' && data.text){
      if(data.user !== this.user.id){
         bot.postMessage(data.channel, "Hello World!", {as_user: true});
      }
   } 
   
})

