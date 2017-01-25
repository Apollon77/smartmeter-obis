var ObisMeasurement = require('../ObisMeasurement');


function JsonEfrProtocol(options, storeCallback) {
    this.options = options;
    this.storeCallback = storeCallback;
}

JsonEfrProtocol.prototype.initState = function initState() {
    //this.lastMessage = undefined; not used in this case, nothing to do because only handling full messages
};

JsonEfrProtocol.prototype.isProcessComplete = function isProcessComplete() {
    return true; // Only receiving from one defined Transport URL and one step, so nothing to do here
};

JsonEfrProtocol.prototype.messagesToSend = function messagesToSend() {
    return 0; // we will not send out any messages
};

JsonEfrProtocol.prototype.getNextMessage = function getNextMessage(commObj) {
    return ''; // we will not send out any messages
};

JsonEfrProtocol.prototype.checkMessage = function checkMessage(message) {
    message = message.toString();
    try {
        var result = JSON.parse(message);
    } catch (e) {
        console.log('JSON parse error:' + e, 'error');
        return false;
    }
    return true;
};

JsonEfrProtocol.prototype.handleMessage = function handleMessage(message) {
    message = message.toString();
    var result = this.prepareResult(JSON.parse(message));

    if (Object.keys(result).length > 0) {
        if (typeof this.storeCallback === 'function') {
            this.storeCallback(result);
        }
    }

    return null;
};

JsonEfrProtocol.prototype.prepareResult = function prepareResult(data) {
    var result = {};

    for (var substruct in data["billingData:"]) {
        for (var i=0;i<data["billingData:"][substruct].length;i++) {
            var obis = new ObisMeasurement(data["billingData:"][substruct][i].obis);
            obis.addValue(data["billingData:"][substruct][i].value, data["billingData:"][substruct][i].unit?data["billingData:"][substruct][i].unit:"");
            result[obis.idToString()]=obis;
        }
    }
    return result;
};

module.exports = JsonEfrProtocol;
