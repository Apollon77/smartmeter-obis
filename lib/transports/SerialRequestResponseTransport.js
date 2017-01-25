var SerialPort = require('serialport');

function SerialRequestResponseTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;
    this.serialConnected = false;
    this.serialComm = undefined;

    this.requestTimer = null;
    this.currentData = null;
}

SerialRequestResponseTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance

    if (!this.serialComm) {
        this.serialComm = new SerialPort(this.options.transportSerialPort, {autoOpen: false, baudrate: this.options.transportSerialBaudrate, databits: 7, stopbits:1, parity:'even', buffersize:2048});

        var self = this;
        this.serialComm.on("data", function (data) {
            if (! self.currentData) {
                self.currentData = data;
            }
            else {
                self.currentData = Buffer.concat([self.currentData, data]);
            }
            //console.log("NEW DATA "+JSON.stringify(data.toString()));
            if (self.protocol.checkMessage(self.currentData)) {
                self.currentData = self.protocol.handleMessage(self.currentData);
                if (!self.protocol.isProcessComplete()) {
                    var messagesToSend = self.protocol.messagesToSend();
                    //console.log("TO-SEND: " + messagesToSend);
                    for (var i = 0; i< messagesToSend; i++) {
                        var nextData = self.protocol.getNextMessage(this);
                        if (typeof nextData === 'string' || typeof nextData === 'object') {
                            if (nextData.length > 0) this.write(nextData);
                            self.serialComm.flush();
                        }
                    }
                }
                if (self.protocol.isProcessComplete()) {
                    this.close();
                    self.requestTimer = setTimeout(function() {
                        self.protocol.initState(); // reset Protocol instance because it will be a new session
                        self.process(); // and open port again
                    }, self.options.requestInterval*1000);
                }
                //console.log("Data left:" + self.currentData);
            }
        });

        this.serialComm.on("error", function (msg) {
            //console.log("error: " + msg);
            self.serialConnected = false;
            self.currentData = null;
        });

        this.serialComm.on("open", function () {
            //console.log("OPEN");
            self.serialConnected = true;
            self.currentData = null;
        });

        this.serialComm.on("disconnect", function (err) {
            //console.log("disconnect: " + err);
            self.serialConnected = false;
            self.currentData = null;
        });

        this.serialComm.on("close", function () {
            //console.log("CLOSE");
            self.serialConnected = false;
            self.currentData = null;
        });

    }
    this.currentData = null;
};

SerialRequestResponseTransport.prototype.process = function process(callback) {
    this.currentData = null;
    var self = this;
    this.serialComm.open(function() {
        var messagesToSend = self.protocol.messagesToSend();
        //console.log("INITIAL TO-SEND: " + messagesToSend);
        for (var i = 0; i< messagesToSend; i++) {
            self.serialComm.write(self.protocol.getNextMessage());
            self.serialComm.flush();
        }
    });
};

module.exports = SerialRequestResponseTransport;
