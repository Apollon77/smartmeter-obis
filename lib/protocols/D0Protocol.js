var ObisMeasurement = require('../ObisMeasurement');

var regSignOnMsg = new RegExp('^(/[^\r\n]{4,22})\r\n');
var regDataMsg = new RegExp('^([^!]+)!\r\n$');

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
    this.commBaudrateInitial = 300;
    this.commBaudrateChangeover = undefined;
    this.deviceIdentification = undefined;
    this.deviceManufacturer = undefined;
}

D0Protocol.prototype.initState = function initState() {
    console.log("INIT");
    this.communicationState = 0; // Reset to "Sign on Response"
    this.commMode = undefined;
    this.commBaudrateChangeover = undefined;
    this.deviceManufacturer = undefined;
    this.deviceIdentification = undefined;
};

D0Protocol.prototype.isProcessComplete = function isProcessComplete() {
    console.log("COMPLETE?: " + this.communicationState);
    return (this.communicationState === 10);
};

D0Protocol.prototype.messagesToSend = function messagesToSend() {
    if (this.communicationState === 0) return 2; // init case, need to send WakeUp and Signon-message
    if (this.communicationState === 1) return 1; // init case, need to send one Signon-message (should never happen)
    if (this.communicationState === 3) {
        if (this.commMode === "C" || this.commMode === "E") return 2; // Mode with Ack AND Baudrate-Change afterwards
            else return 1; // only baudrate change
    }
    return 0;
};

D0Protocol.prototype.getNextMessage = function getNextMessage(commObj) {
    console.log("NEXT MSG " + this.communicationState);
    var init = "";
    if (this.communicationState === 0) {
        this.communicationState = 1;
        for (i = 0; i < this.options.protocolD0WakeupCharacters; i++) init += "\0";
        return init;
    }
    else if (this.communicationState === 1) {
        this.communicationState = 2;
        init = "/";
        if (this.options.protocolD0SignOnMessage && this.options.protocolD0SignOnMessage !== '') {
            init += this.options.protocolD0SignOnMessage;
        }
        else {
            init += "?"; // Default mandatory values
        }

        if (this.options.protocolD0DeviceAddress) init += this.options.protocolD0DeviceAddress.substring(0,32);
        init += "!\r\n";
        return init;
    }
    else if (this.communicationState === 3) {
        this.communicationState = 4;
        return this.generateAckMessage();
    }
    else if (this.communicationState === 4) {
        if (this.commBaudrateInitial !== this.commBaudrateChangeover) {
            console.log("BAUD CHANGEOVER TO " + this.commBaudrateChangeover + " baud");
            commObj.update({baudrate: this.commBaudrateChangeover});
        }
    }
    return '';
};

D0Protocol.prototype.checkMessage = function checkMessage(message) {
    console.log("CHECK MSG " + this.communicationState);
    message = message.toString();
    var regMessage;
    if (this.communicationState === 2 || this.communicationState === 0) {
        regMessage = message.match(regSignOnMsg);
        console.log("1: "+JSON.stringify(message) + " -> " + JSON.stringify(regMessage));
        if (regMessage && regMessage[1] !== "") {
            if (this.communicationState === 0) {
                this.commMode = "D";
                this.communicationState = 2; // Mode D :-)
            }
            return true;
        }
        return false;
    }
    else if (this.communicationState >= 3) {
        regMessage = message.match(regDataMsg);
        console.log("2: "+JSON.stringify(message) + " -> " + JSON.stringify(regMessage));
        return (regMessage && regMessage[1] !== "");
    }
    console.log("No match for Message " + JSON.stringify(message));
};

D0Protocol.prototype.handleMessage = function handleMessage(message) {
    console.log("HANDLE MSG " + this.communicationState);
    message = message.toString();
    var regMessage;
    if (this.communicationState === 2) {
        regMessage = message.match(regSignOnMsg);
        if (!regMessage || !regMessage[1]) {
            throw new Error('Message ' + message + 'invalid');
        }

        this.handleSignOnResponseMessage(regMessage[1]);
        if (this.commMode === "C" || this.commMode === "E") this.communicationState = 3; // we need to send an Ack-Message
            else this.communicationState = 4; // Ack not needed
    }
    else if (this.communicationState === 4) {
        regMessage = message.match(regDataMsg);
        if (!regMessage || !regMessage[1]) {
            throw new Error('Message ' + message + 'invalid');
        }

        var result = this.prepareResult(regMessage[1]);
        if (Object.keys(result).length === 0) {
            throw new Error('Message CRC-Check invalid -> no data available');
        }
        else {
            if (typeof this.storeCallback === 'function') this.storeCallback(result);
            this.communicationState = 10;
        }
    }

    if (message.length > regMessage[1].length) return new Buffer(message.substring(regMessage[1].length+2));
    return null;
};

D0Protocol.prototype.prepareResult = function prepareResult(data) {
    var splitted = data.split(")");

    var result={};
    for (var i=0;i<splitted.length;i++) {
        if (splitted[i]==="!" || splitted[i]==="") continue;
        splitted[i]+=")";
        var msg_splitted=splitted[i].match(/^([^\(]*)\(([^\)]*)\)/);
        //console.log (JSON.stringify(msg_splitted));
        if (msg_splitted) {
            msg_splitted[1] = msg_splitted[1].trim();
            var obis = new ObisMeasurement(msg_splitted[1], this.options.obisFallbackMedium);
            obis.setRawValue(msg_splitted[2]);

            if (msg_splitted[2].match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}&[0-9]{2}:[0-9]{2}:[0-9]{2}$/)) {
                msg_splitted[2] = msg_splitted[2].substring(0,10)+"T"+msg_splitted[2].substring(11);
            }
            var msg_values=msg_splitted[2].split("&");
            for (var j=0; j<msg_values.length; j++) {
                var value = msg_values[j].split("*");
                if (!value[1]) {
                    value[1]="";
                }
                else {
                    if (value[0].indexOf(".")!==-1) value[0]=parseFloat(value[0]);
                      else value[0]=parseInt(value[0],10);
                }
                obis.addValue(value[0], value[1]);
             }
             result[obis.idToString()]=obis;
        }
    }
    return result;
};

D0Protocol.prototype.handleSignOnResponseMessage = function handleSignOnResponseMessage(dataString) {
    if (dataString.charAt(0) === "/") {
        this.deviceManufacturer  = dataString.substring(1,4);
        switch (dataString.charAt(4)) {
            case "A":
                this.commMode = "B";
                this.commBaudrateChangeover = 600;
                break;
            case "B":
                this.commMode = "B";
                this.commBaudrateChangeover = 1200;
                break;
            case "C":
                this.commMode = "B";
                this.commBaudrateChangeover = 2400;
                break;
            case "D":
                this.commMode = "B";
                this.commBaudrateChangeover = 4800;
                break;
            case "E":
                this.commMode = "B";
                this.commBaudrateChangeover = 9600;
                break;
            case "F":
                this.commMode = "B";
                this.commBaudrateChangeover = 19200;
                break;
            case "0":
                this.commMode = "C"; // E
                this.commBaudrateChangeover = 300;
                break;
            case "1":
                this.commMode = "C"; // E
                this.commBaudrateChangeover = 600;
                break;
            case "2":
                this.commMode = "C"; // E
                this.commBaudrateChangeover = 1200;
                break;
            case "3":
                if (this.commMode !== "D") this.commMode = "C"; // E or D
                this.commBaudrateChangeover = 2400;
                break;
            case "4":
                this.commMode = "C"; // E
                this.commBaudrateChangeover = 4800;
                break;
            case "5":
                this.commMode = "C"; // E
                this.commBaudrateChangeover = 9600;
                break;
            case "6":
                this.commMode = "C"; // E
                this.commBaudrateChangeover = 19200;
                break;
            default:
                this.commMode = "A";
                this.commBaudrateChangeover = this.commBaudrateInitial;
        }

        if (dataString.charAt(5)==="\\") {
            if (this.commMode === "C") {
                this.commMode = 'E';
            }
            else {
                throw new Error('D0 Protocol E not supported AND invalid mode detection flow from ' + this.commMode + ' to E! Please contact the developer');
            }
            this.commModeDetail = dataString.charAt(6);
            this.deviceIdentification = dataString.substring(7);
            throw new Error('D0 Protocol E (' + this.commModeDetail + ') not supported! Please contact the developer');
        }
        else {
            this.deviceIdentification = dataString.substring(5);
        }

    }
};

D0Protocol.prototype.generateAckMessage = function generateAckMessage() {
    var ack = String.fromCharCode(6); // ACK
    ack += "0" // only normal protocol supported

    switch (this.commBaudrateChangeover) {
        case 300:   ack+="0";
                    break;
        case 600:   ack+="1";
                    break;
        case 1200:  ack+="2";
                    break;
        case 2400:  ack+="3";
                    break;
        case 4800:  ack+="4";
                    break;
        case 9600:  ack+="5";
                    break;
        case 19200: ack+="6";
                    break;
        default: throw new Error('invalid baudrate ' + this.commBaudrateChangeover);
    }

    ack += "0"; // only reading mode supported
    ack += "\r\n";
    return ack;
};


module.exports = D0Protocol;
