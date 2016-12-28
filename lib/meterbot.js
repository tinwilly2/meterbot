'use strict';

var Bot = require('slackbots');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;


var bot = new Bot({
    token: token,
    name: name
});


bot.on('start', function () {
    loadBotUser();
});
bot.on('message', function (message) {
    console.log('message');
    if (isChatMessage(message) &&
        isChannelConversation(message) &&
        !isFromMeterbot(message)
    ) {
        sendHelloWorld(message);
    }
});

/**
 * Sends some stuff back to the channel
 * @param {object} originalMessage
 * @private
 */
function sendHelloWorld(originalMessage) {
    var textforsending = "Hello World!";
    var channel = bot.getChannelById(originalMessage.channel);
    bot.postMessageToChannel(channel.name, textforsending, {as_user:true});
};

/**
 * Loads the user object representing the bot
 * @private
 */
function loadBotUser() {
    bot.user = bot.users.filter(function (user) {
        return user.name === bot.name;
    })[0];
};


/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
function isChatMessage(message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
function isChannelConversation(message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};


/**
 * Util function to check if a given real time message has ben sent by the meterbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
function isFromMeterbot(message) {
    return message.user === bot.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
function getChannelById(channelId) {
    return bot.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};
