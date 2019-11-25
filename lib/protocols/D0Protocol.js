/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var ObisMeasurement = require('../ObisMeasurement');

var regSignOnMsg = new RegExp('(/[^\r\n]{4,22})\r\n');
var regDataMsg = new RegExp('\u0002?([A-Za-z0-9][^!]+)![A-Za-z0-9]*\r\n\u0003?[^]?');
var regDataMsgFallback = new RegExp('\u0002([A-Za-z0-9][^!]+)');

/* Protocol Mode A: No baud changeover, detected by non valid baudrate changeover cvharacter from B-E
 * Protocol Mode B: Baud Changeover supported, No Ack Message
 * Protocol Mode C: Baud Changeover supported, With Ack Message
 * Protocol Mode D: No Request needed, Device sends data, No Baudrate changeover, start with 2400 baud (normally)
 * Protocol Mode E: Baud Changeover supported, With Ack Message, Used protocol defined by additional data in Identification Message
 */


function D0Protocol(options, storeCallback) {
    this.options = options;
    this.storeCallback = storeCallback;

    this.communicationState = 0;

    this.commMode = undefined;
    this.commModeDetail = undefined;
    this.commBaudrateInitial = this.options.transportSerialBaudrate;
    this.commBaudrateChangeover = undefined;
    this.deviceIdentification = undefined;
    this.deviceManufacturer = undefined;

    if (!this.options.protocolD0WakeupCharacters) this.options.protocolD0WakeupCharacters = 0;
    if (!this.options.protocolD0SignOnMessage) this.options.protocolD0SignOnMessage = '?';
    if (!this.options.protocolD0DeviceAddress) this.options.protocolD0DeviceAddress = '';

    this.signOnMessages = this.options.protocolD0SignOnMessage.split(',');
    this.signOnMessageCounter = 0;
}

D0Protocol.prototype.setTransportResetCallback = function setTransportResetCallback(callback) {
    this.transportResetCallback = callback;
};

D0Protocol.prototype.initState = function initState() {
    //console.log('INIT');
    this.communicationState = 0; // Reset to 'Sign on Response'
    this.commMode = undefined;
    this.commBaudrateChangeover = undefined;
    this.deviceManufacturer = undefined;
    this.deviceIdentification = undefined;
};

D0Protocol.prototype.checkMessageAfterBufferOverrun = function checkMessageAFterBufferOverrun() {
    return false;
};

D0Protocol.prototype.isProcessComplete = function isProcessComplete() {
    if (this.options.debug === 2) this.options.logger('CURRENT PROCESS STEP ' + this.communicationState + ' IN ISPROCESSCOMPLETE: ' + (this.communicationState === 10));
    return (this.communicationState === 10);
};

D0Protocol.prototype.anotherQueryAvailable = function anotherQueryAvailable() {
    if (this.options.debug === 2) this.options.logger('CURRENT SIGNON MESSAGE COUNTER ' + this.signOnMessageCounter + ' OF ' + (this.signOnMessages.length));
    return (this.signOnMessageCounter < this.signOnMessages.length);
};

D0Protocol.prototype.messagesToSend = function messagesToSend() {
    if (this.communicationState === 0) return 2; // init case, need to send WakeUp and Signon-message
    if (this.communicationState === 1) return 1; // init case, need to send one Signon-message (should never happen)
    if (this.communicationState === 3) {
        if (this.commMode === 'C' || this.commMode === 'E') return 2; // Mode with Ack AND Baudrate-Change afterwards
            else return 1; // only baudrate change
    }
    if (this.communicationState === 4) {
        if (this.commBaudrateInitial !== this.commBaudrateChangeover) return 1; // We need to do a baudrate change
    }
    return 0;
};

D0Protocol.prototype.getNextMessage = function getNextMessage(commObj, callback) {
    if (this.options.debug === 2) this.options.logger('CURRENT PROCESS STEP ' + this.communicationState + ' IN GETNEXTMESSAGE');
    var init = '';
    if (this.communicationState === 0) {
        this.communicationState = 1;
        for (var i = 0; i < this.options.protocolD0WakeupCharacters; i++) init += '\0';
        callback(init);
        return;
    }
    else if (this.communicationState === 1) {
        this.communicationState = 2;
        if (this.signOnMessageCounter >= this.signOnMessages.length) this.signOnMessageCounter = 0;
        init = '/' + this.signOnMessages[this.signOnMessageCounter++];

        if (this.options.protocolD0DeviceAddress) init += this.options.protocolD0DeviceAddress.substring(0,32);
        init += '!\r\n';
        callback(init);
        return;
    }
    else if (this.communicationState === 3) {
        this.communicationState = 4;
        callback(this.generateAckMessage());
        return;
    }
    else if (this.communicationState === 4) {
        if (this.commMode !== 'A' && this.commBaudrateInitial !== this.commBaudrateChangeover) {
            if (!commObj || typeof commObj.update !== 'function') {
                this.callUserCallback(new Error('Serialport instance needed for baudrate changeover'), null);
                callback('');
                return;
            }
            if (this.options.debug === 2) this.options.logger('BAUD CHANGEOVER TO ' + this.commBaudrateChangeover + ' baud');
            var self = this;
            commObj.update({baudRate: this.commBaudrateChangeover}, function (error) {
                if (self.options.debug === 2) self.options.logger('BAUD CHANGEOVER DONE');
                if (error) {
                    self.options.logger('EROR ON BAUD CHANGEOVER!');
                }
                callback('');
            });
            return;
        }
    }
    callback('');
};

D0Protocol.prototype.checkMessage = function checkMessage(message) {
    if (this.options.debug === 2) this.options.logger('CURRENT PROCESS STEP ' + this.communicationState + ' IN CHECKMESSAGE');
    message = message.toString();
    var regMessage;
    if (this.communicationState === 2 || this.communicationState === 0) {
        regMessage = message.match(regSignOnMsg);
        if (this.options.debug === 2) this.options.logger('MATCH-RESULT SIGNON: ' + JSON.stringify(message) + ' -> ' + JSON.stringify(regMessage));
        if (regMessage && regMessage[1] !== '') {
            if (this.communicationState === 0) {
                this.commMode = 'D';
                this.communicationState = 2; // Mode D :-)
            }
            return true;
        }
        return false;
    }
    else if (this.communicationState >= 3) {
        regMessage = message.match(regDataMsg);
        if (this.options.debug === 2) this.options.logger('MATCH-RESULT DATA: ' + JSON.stringify(message) + ' -> ' + JSON.stringify(regMessage));
        if (this.communicationState === 3) this.communicationState = 4; //we ignore the Ack Message because data already there
        return (regMessage && regMessage[1] !== '');
    }
    this.callUserCallback(new Error('No match for Message ' + JSON.stringify(message)), null);
};

D0Protocol.prototype.handleMessage = function handleMessage(message) {
    if (this.options.debug === 2) this.options.logger('CURRENT PROCESS STEP ' + this.communicationState + ' IN HANDLEMESSAGE');
    message = message.toString();
    var regMessage;
    if (this.communicationState === 2) {
        regMessage = message.match(regSignOnMsg);
        if (!regMessage || !regMessage[1]) {
            this.callUserCallback(new Error('Message ' + message + 'invalid'), null);
            return null;
        }

        this.handleSignOnResponseMessage(regMessage[1]);
        if (this.commMode === 'C' || this.commMode === 'E') this.communicationState = 3; // we need to send an Ack-Message
            else this.communicationState = 4; // Ack not needed
        var idx = message.indexOf(regMessage[1]);
        if (idx !== -1) {
            return Buffer.from(message.substr(idx+regMessage[1].length+2));
        }
    }
    else if (this.communicationState === 4) {
        regMessage = message.match(regDataMsg);
        if (!regMessage || !regMessage[1]) {
            this.callUserCallback(new Error('Message ' + message + 'invalid'), null);
            return null;
        }
        if (regMessage[1].indexOf('\u0002') !== -1) {
            regMessage = regMessage[1].match(regDataMsgFallback);
            if (!regMessage || !regMessage[1]) {
                this.callUserCallback(new Error('Message ' + message + 'invalid'), null);
                return null;
            }
        }

        var result = this.prepareResult(regMessage[1]);
        var idx = message.indexOf(regMessage[1]);
        if (Object.keys(result).length === 0) {
            this.callUserCallback(new Error('no data available'), null);
            if (idx !== -1) {
                return Buffer.from(message.substr(idx+regMessage[1].length+2));
            }
        }
        else {
            if (this.options.debug === 2) this.options.logger('STORE DATA');
            if (typeof this.storeCallback === 'function') {
                this.storeCallback(null, result);
            }
            this.communicationState = 10;
            if (idx !== -1) {
                return Buffer.from(message.substr(idx+regMessage[1].length+2));
            }
        }
    }

    return null;
};

D0Protocol.prototype.callUserCallback = function callUserCallback(err, data) {
    if (err) {
        if (this.options.debug !== 0) this.options.logger(err);
    }
    if (typeof this.storeCallback === 'function') {
        this.storeCallback(err, data);
        if (err) {
            if (this.transportResetCallback) this.transportResetCallback();
        }
    }
    else if (err) {
        throw err;
    }
};

D0Protocol.prototype.prepareResult = function prepareResult(data) {
    var splitted = data.split(')');

    var result = {};
    var currentObis = null;
    var currentObisRaw = '';
    for (var i=0;i<splitted.length;i++) {
        if (splitted[i] === '!' || splitted[i] === '') continue;
        splitted[i]+=')';
        //console.log(splitted[i]);
        var msg_splitted=splitted[i].match(/^([^\(]*)\(([^\)]*)\)/);
        //console.log(msg_splitted);
        if (msg_splitted) {
            msg_splitted[1] = msg_splitted[1].trim();
            if (currentObis && msg_splitted[1] === '') { // We have a OBIS object and got another value in brackets
                currentObisRaw += ', ' + msg_splitted[2];
            }
            else {
                if (currentObis) { // we need to finish the current OBIS Object
                    currentObis.setRawValue(currentObisRaw);
                    result[currentObis.idToString()] = currentObis;

                    currentObis = null;
                    currentObisRaw = '';
                }
                try {
                    currentObis = new ObisMeasurement(msg_splitted[1], this.options.obisFallbackMedium);
                }
                catch (e) {
                    var lines = msg_splitted[1].split("\r\n");
                    if (lines.length > 1) {
                        try {
                            currentObis = new ObisMeasurement(lines[lines.length-1], this.options.obisFallbackMedium);
                            this.callUserCallback(new Error('Error while parsing D0 content: ignore content before linebreak ' + e), null);
                        }
                        catch (e2) {
                            this.callUserCallback(new Error('Error while parsing D0 content: ignore complete part ' + e), null);
                            currentObis = null;
                            continue;
                        }
                    }
                    else {
                        this.callUserCallback(new Error('Error while parsing D0 content: ignore complete part ' + e), null);
                        currentObis = null;
                        continue;
                    }
                }
                currentObisRaw = msg_splitted[2];
            }

            if (msg_splitted[2].match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}&[0-9]{2}:[0-9]{2}:[0-9]{2}$/)) {
                msg_splitted[2] = msg_splitted[2].substring(0,10)+'T' + msg_splitted[2].substr(11);
            }
            var msg_values;
            if (msg_splitted[2].indexOf('#') !== -1) {
                msg_values=msg_splitted[2].split('#');
            }
            else {
                msg_values=msg_splitted[2].split('&');
            }
            for (var j=0; j<msg_values.length; j++) {
                var value = msg_values[j].split('*');
                if (!value[1]) {
                    value[1]='';
                }
                else {
                    if (value[0].indexOf('.')!==-1) value[0]=parseFloat(value[0]);
                      else value[0]=parseInt(value[0],10);
                }
                currentObis.addValue(value[0], value[1]);
             }
        }
    }
    if (currentObis) { // we need to finish the current OBIS Object
        currentObis.setRawValue(currentObisRaw);
        result[currentObis.idToString()] = currentObis;
    }
    return result;
};

D0Protocol.prototype.handleSignOnResponseMessage = function handleSignOnResponseMessage(dataString) {
    if (dataString.charAt(0) === '/') {
        this.deviceManufacturer  = dataString.substring(1,4);
        switch (dataString.charAt(4)) {
            case 'A':
                this.commMode = 'B';
                this.commBaudrateChangeover = 600;
                break;
            case 'B':
                this.commMode = 'B';
                this.commBaudrateChangeover = 1200;
                break;
            case 'C':
                this.commMode = 'B';
                this.commBaudrateChangeover = 2400;
                break;
            case 'D':
                this.commMode = 'B';
                this.commBaudrateChangeover = 4800;
                break;
            case 'E':
                this.commMode = 'B';
                this.commBaudrateChangeover = 9600;
                break;
            case 'F':
                this.commMode = 'B';
                this.commBaudrateChangeover = 19200;
                break;
            case '0':
                this.commMode = 'C'; // E
                this.commBaudrateChangeover = 300;
                break;
            case '1':
                this.commMode = 'C'; // E
                this.commBaudrateChangeover = 600;
                break;
            case '2':
                this.commMode = 'C'; // E
                this.commBaudrateChangeover = 1200;
                break;
            case '3':
                if (this.commMode !== 'D') this.commMode = 'C'; // E or D
                this.commBaudrateChangeover = 2400;
                break;
            case '4':
                this.commMode = 'C'; // E
                this.commBaudrateChangeover = 4800;
                break;
            case '5':
                this.commMode = 'C'; // E
                this.commBaudrateChangeover = 9600;
                break;
            case '6':
                this.commMode = 'C'; // E
                this.commBaudrateChangeover = 19200;
                break;
            default:
                this.commMode = 'A';
                this.commBaudrateChangeover = this.commBaudrateInitial;
        }

        if (dataString.charAt(5)==='\\') {
            if (this.commMode === 'C') {
                this.commMode = 'E';
            }
            else {
                this.callUserCallback(new Error('D0 Protocol E not supported AND invalid mode detection flow from ' + this.commMode + ' to E! Please contact the developer'), null);
                return;
            }
            this.commModeDetail = dataString.charAt(6);
            this.deviceIdentification = dataString.substr(7);
            if (this.options.debug === 2 ) this.options.logger('D0 Protocol E (' + this.commModeDetail + ') not fully supported! Let us try it :-) Please contact the developer if you have problems');
        }
        else {
            this.deviceIdentification = dataString.substr(5);
        }
    }
    if (this.options.protocolD0ModeOverwrite) {
        if (this.options.debug === 2) this.options.logger('OVERWRITE D0-MODE ' + this.commMode + ' WITH ' + this.options.protocolD0ModeOverwrite);
        this.commMode = this.options.protocolD0ModeOverwrite;
    }
    if (this.commMode !== 'A' && this.options.protocolD0BaudrateChangeoverOverwrite) {
        if (this.options.debug === 2) this.options.logger('OVERWRITE BAUDRATE-CHANGEOVER ' + this.commBaudrateChangeover + ' WITH ' + this.options.protocolD0BaudrateChangeoverOverwrite);
        this.commBaudrateChangeover = this.options.protocolD0BaudrateChangeoverOverwrite;
    }
};

D0Protocol.prototype.generateAckMessage = function generateAckMessage() {
    var ack = String.fromCharCode(6); // ACK
    ack += '0'; // only normal protocol supported

    switch (this.commBaudrateChangeover) {
        case 300:   ack+='0';
                    break;
        case 600:   ack+='1';
                    break;
        case 1200:  ack+='2';
                    break;
        case 2400:  ack+='3';
                    break;
        case 4800:  ack+='4';
                    break;
        case 9600:  ack+='5';
                    break;
        case 19200: ack+='6';
                    break;
        default: this.callUserCallback(new Error('invalid baudrate ' + this.commBaudrateChangeover), null);
                 return "";
    }

    ack += '0'; // only reading mode supported
    ack += '\r\n';
    return ack;
};


module.exports = D0Protocol;
