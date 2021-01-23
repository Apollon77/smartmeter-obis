/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var OpenSml = require('open-sml');
var ObisMeasurement = require('../ObisMeasurement');


//var regCompleteMsg = new RegExp('^.*(1b1b1b1b01010101.*1b1b1b1b.{8})');
var regCompleteMsg = /((1b1b1b1b01010101((?!1b1b1b1b.{8}).)*1b1b1b1b.{8}))/i;

function SmlProtocol(options, storeCallback) {
    this.options = options;
    this.storeCallback = storeCallback;
}

SmlProtocol.prototype.convertMessageBufferToHex = function convertMessageBufferToHex(data) {
    switch (this.options.protocolSmlInputEncoding) {
        case 'ascii':
            return Buffer.from(data,'ascii').toString();
        case 'utf-8':
            return Buffer.toString();
        case 'base64':
            return Buffer.from(data,'base64').toString('hex');
        default: // binary data representation
            return data.toString('hex');
    }
}

SmlProtocol.prototype.setTransportResetCallback = function setTransportResetCallback(callback) {
    this.transportResetCallback = callback;
};

SmlProtocol.prototype.checkMessageAfterBufferOverrun = function checkMessageAFterBufferOverrun() {
    return true;
};

SmlProtocol.prototype.initState = function initState() {
    //this.lastMessage = undefined; not used in this case, nothing to do because only handling full messages
};

SmlProtocol.prototype.isProcessComplete = function isProcessComplete() {
    return true; // Only receiving and one step, so nothing to do here
};

SmlProtocol.prototype.anotherQueryAvailable = function anotherQueryAvailable() {
    return false;
};

SmlProtocol.prototype.messagesToSend = function messagesToSend() {
    return 0; // we will not send out any messages
};

SmlProtocol.prototype.getNextMessage = function getNextMessage(commObj, callback) {
    callback('');
    return; // we will not send out any messages
};

SmlProtocol.prototype.checkMessage = function checkMessage(message) {
    message = this.convertMessageBufferToHex(message);
    var regMessage = message.match(regCompleteMsg);
    if (this.options.debug === 2) this.options.logger('MATCH-RESULT MESSAGE: ' + JSON.stringify(message) + ' -> ' + JSON.stringify(regMessage,null,2));
    return (regMessage && regMessage[1] !== '');
};

SmlProtocol.prototype.handleMessage = function handleMessage(message) {
    message = this.convertMessageBufferToHex(message);
    var regMessage = message.match(regCompleteMsg);
    if (!regMessage || !regMessage[1]) {
        this.callUserCallback(new Error('Message ' + message + 'invalid'), null);
        return null;
    }

    var smlFile = new OpenSml.SmlFile();

    var idx = message.indexOf(regMessage[1]);
    if (this.options.debug === 2) this.options.logger('MSG IDX ' + idx);
    try {
        smlFile.parse(Buffer.from(regMessage[1], 'hex'));
    }
    catch (err) {
        smlFile = null;
        this.callUserCallback(new Error('Error while parsing SML message: ' + err + ': Message: ' + regMessage[1]), null);
        if (idx !== -1) {
            return Buffer.from(message.substr(idx+regMessage[1].length), 'hex');
        }
        return null;
    }

    if (this.options.debug === 2) this.options.logger('SML MESSAGE: ' + smlFile.toString());

    var result = {};
    var crcCheck = true; // we ignore whole-Message CRC (smlFile.valid;) only check detail CRCs
    if (crcCheck) {
        for (var msg in smlFile.messages) {
            if (smlFile.messages[msg].getMessageTag() === OpenSml.Constants.GET_LIST_RESPONSE) {
                crcCheck &= smlFile.messages[msg].isValid();
                if (smlFile.messages[msg].isValid() || this.options.protocolSmlIgnoreInvalidCRC) {
                    var messageBody = smlFile.messages[msg].getMessageBody();
                    if (messageBody) {
                        Object.assign(result, this.prepareResult(messageBody.getValList()));
                    }
                }
            }
            else if (smlFile.messages[msg].getMessageTag() === OpenSml.Constants.GET_PROFILE_LIST_RESPONSE) {
                crcCheck &= smlFile.messages[msg].isValid();
                if (smlFile.messages[msg].isValid() || this.options.protocolSmlIgnoreInvalidCRC) {
                    var messageBody = smlFile.messages[msg].getMessageBody();
                    if (messageBody) {
                        Object.assign(result, this.prepareResult(messageBody.getPeriodList()));
                    }
                }
            }
    	}
    }
    if (Object.keys(result).length === 0) {
        if (!crcCheck && !this.options.protocolSmlIgnoreInvalidCRC) {
            smlFile = null;
            this.callUserCallback(new Error('Message CRC-Check invalid -> no data available'), null);
            if (idx !== -1) {
                return Buffer.from(message.substr(idx+regMessage[1].length), 'hex');
            }
            return null;
        }
    }
    else {
        if (!crcCheck && this.options.protocolSmlIgnoreInvalidCRC) {
            if (this.options.debug !== 0) this.options.logger('CRC MISMATCH IN SML MESSAGE IGNORED!');
        }

        if (this.options.debug === 2) this.options.logger('STORE DATA');
        if (typeof this.storeCallback === 'function') {
            this.storeCallback(null, result);
        }
        smlFile = null;
        if (idx !== -1) {
            return Buffer.from(message.substr(idx+regMessage[1].length), 'hex');
        }
    }

    smlFile = null;
    return null; // ignore pot. other data in message ... we use the next message
};

SmlProtocol.prototype.callUserCallback = function callUserCallback(err, data) {
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

SmlProtocol.prototype.prepareResult = function prepareResult(list) {
    var result = {};
    for (var i = 0; i < list.getLength(); i++) {
        var entry = list.getListEntryAt(i);
        var obis = new ObisMeasurement(entry.getObjName());
        var value = entry.getValue();
        var unit = entry.getUnit();
        if (typeof value === 'number' && entry.getScaler()) {
            value *= Math.pow(10,entry.getScaler());
        }
        obis.addValue(value, unit);
        result[obis.idToString()]=obis;
    }
    return result;
};

module.exports = SmlProtocol;
