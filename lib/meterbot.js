'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *      token : the API token of the bot (mandatory)
 *      name : the name of the bot (will default to "meterbot")
 *
 * @param {object} settings
 * @constructor
 *
 * @author Martin Williams
 */
var meterbot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'meterbot';

    this.user = null;

    super(this, this.settings);

};

// inherits methods and properties from the Bot constructor
util.inherits(meterbot, Bot);

/**
 * Run the bot
 * @public
 */
meterbot.prototype.run = function () {

    //meterbot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
meterbot.prototype._onStart = function () {
    this._loadBotUser();
    this._firstRunCheck();
};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
meterbot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromMeterbot(message)
    ) {
        this._sendHelloWorld(message);
    }
};

/**
 * Sends some stuff back to the channel
 * @param {object} originalMessage
 * @private
 */
meterbot.prototype._sendHelloWorld = function (originalMessage) {
    var self = this;
    var textforsending = "Hello World!";
    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, textforsending, {as_user:true});
};

/**
 * Loads the user object representing the bot
 * @private
 */
meterbot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

/**
 * Check if the first time the bot is run. It's used to send a welcome message into the channel
 * @private
 */
meterbot.prototype._firstRunCheck = function () {
    var self = this;
};

/**
 * Sends a welcome message in the channel
 * @private
 */
meterbot.prototype._welcomeMessage = function () {
    this.postMessageToChannel(this.channels[0].name, 'Hi guys! Meterbot saying hello! ' +
        '\n I do stuff with meter readings. Just say `' + this.name + '` to invoke me!',
        {as_user: true});
};

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
meterbot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
meterbot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};


/**
 * Util function to check if a given real time message has ben sent by the meterbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
meterbot.prototype._isFromMeterbot = function (message) {
    return message.user === this.user.id;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
meterbot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = meterbot;
