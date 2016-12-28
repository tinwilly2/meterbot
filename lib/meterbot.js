'use strict';

var Bot = require('slackbots');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;


var bot = new Bot({
    token: token,
    name: name
});


bot.on('start', onStart);
bot.on('message', onMessage);

};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
onStart = function () {
    loadBotUser();
};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
onMessage = function (message) {
    if (isChatMessage(message) &&
        isChannelConversation(message) &&
        !isFromMeterbot(message)
    ) {
        sendHelloWorld(message);
    }
};

/**
 * Sends some stuff back to the channel
 * @param {object} originalMessage
 * @private
 */
sendHelloWorld = function (originalMessage) {
    var textforsending = "Hello World!";
    var channel = bot.getChannelById(originalMessage.channel);
    bot.postMessageToChannel(channel.name, textforsending, {as_user:true});
};

/**
 * Loads the user object representing the bot
 * @private
 */
loadBotUser = function () {
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
isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};


/**
 * Util function to check if a given real time message has ben sent by the meterbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
isFromMeterbot = function (message) {
    return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
getChannelById = function (channelId) {
    return bot.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};
