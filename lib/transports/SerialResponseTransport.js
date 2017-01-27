var SerialPort = require('serialport');

function SerialResponseTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;
    this.serialConnected = false;
    this.serialComm = undefined;

    this.requestTimer = null;
    this.stopRequests = false;
    this.currentData = null;

    if (!this.options.transportSerialBaudrate) this.options.transportSerialBaudrate = 9600;
    if (!this.options.transportSerialDataBits) this.options.transportSerialDataBits = 8;
    if (!this.options.transportSerialStopBits) this.options.transportSerialStopBits = 1;
    if (!this.options.transportSerialParity) this.options.transportSerialParity = 'none';
    if (!this.options.transportSerialMaxBufferSize) this.options.transportSerialMaxBufferSize = 300000;
}

SerialResponseTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance

    if (!this.serialComm) {
        this.serialComm = new SerialPort(this.options.transportSerialPort, {
            autoOpen:   false,
            baudrate:   this.options.transportSerialBaudrate,
            databits:   this.options.transportSerialDataBits,
            stopbits:   this.options.transportSerialStopBits,
            parity:     this.options.transportSerialParity,
            buffersize: 2048
        });
        if (this.options.debug === 2) this.options.logger('CREATE SERIALPORT: ' + this.options.transportSerialBaudrate + ' '  + this.options.transportSerialDataBits + ' '  + this.options.transportSerialStopBits + ' '  + this.options.transportSerialParity);
    }
    var self = this;
    this.serialComm.on('data', function (data) {
        if (! self.currentData) {
            self.currentData = data;
        }
        else {
            self.currentData = Buffer.concat([self.currentData, data]);
        }
        if (self.protocol.checkMessage(self.currentData)) {
            if (self.options.debug === 2) self.options.logger('PAUSE READING SERIALPORT TO HANDLE MESSAGE');
            this.pause();
            self.currentData = self.protocol.handleMessage(self.currentData);
            if (!self.protocol.isProcessComplete()) {
                if (self.protocol.messagesToSend() > 0) {
                    throw Error('SerialResponseTransport do not support sending of Data!');
                }
            }
            if (self.protocol.isProcessComplete()) {
                if (self.options.requestInterval===0 && !self.stopRequests) {
                    if (self.options.debug === 2) self.options.logger('RESUME READING SERIALPORT');
                    this.resume(); // we want to read continously
                }
                else {
                    if (self.options.debug === 2) self.options.logger('SCHEDULE NEXT RUN IN ' + self.options.requestInterval + 's');
                    this.close();
                    if (!self.stopRequests) {
                        self.requestTimer = setTimeout(function() {
                            self.protocol.initState(); // reset Protocol instance because it will be a new session
                            self.process(); // and open port again
                        }, self.options.requestInterval*1000);
                    }
                }
            }
            if (self.options.debug === 2 && self.currentData) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + self.currentData.toString());
        }
        else if (self.currentData.length > this.options.transportSerialMaxBufferSize) {
            throw Error('Maximal Buffer size reached without matching message : ' + self.currentData.toString());
        }
    });

    this.serialComm.on('error', function (msg) {
        if (self.options.debug !== 0) self.options.logger('SERIALPORT ERROR: ' + msg);
        self.serialConnected = false;
        self.currentData = null;
    });

    this.serialComm.on('open', function () {
        if (self.options.debug === 2) self.options.logger('SERIALPORT OPEN');
        self.serialConnected = true;
        self.currentData = null;
    });

    this.serialComm.on('disconnect', function (err) {
        if (self.options.debug !== 0) self.options.logger('SERIALPORT DISCONNECTED: ' + msg);
        self.serialConnected = false;
        self.currentData = null;
    });

    this.serialComm.on('close', function () {
        if (self.options.debug === 2) self.options.logger('SERIALPORT CLOSE');
        self.serialConnected = false;
        self.currentData = null;
        if (this.stopRequests) {
            self.serialComm.removeAllListeners();
        }
    });

    this.currentData = null;
};

SerialResponseTransport.prototype.process = function process() {
    this.currentData = null;
    this.serialComm.open();
};

SerialResponseTransport.prototype.stop = function stop() {
    this.stopRequests = true;
    if (this.requestTimer) clearTimeout(this.requestTimer);
    this.serialComm.close();
    this.serialComm = null;
};

module.exports = SerialResponseTransport;
