# bin/bot.js

'use strict';

var meterbot = require('../lib/meterbot');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;

var meterbotinstance = new meterbot({
    token: token,
    name: name
});

meterbotinstance.run();
