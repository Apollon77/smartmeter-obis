var SerialPort = require('serialport');

function SerialRequestResponseTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;
    this.serialConnected = false;
    this.serialComm = undefined;

    this.requestTimer = null;
    this.stopRequests = false;
    this.currentData = null;
    this.messageTimeoutTimer = null;

    if (!this.options.transportSerialBaudrate) this.options.transportSerialBaudrate = 300;
    if (!this.options.transportSerialDataBits) this.options.transportSerialDataBits = 7;
    if (!this.options.transportSerialStopBits) this.options.transportSerialStopBits = 1;
    if (!this.options.transportSerialParity) this.options.transportSerialParity = 'even';
    if (!this.options.transportSerialMaxBufferSize) this.options.transportSerialMaxBufferSize = 300000;
    if (!this.options.transportSerialMessageTimeout) this.options.transportSerialMessageTimeout = 60000;
}

SerialRequestResponseTransport.prototype.init = function init() {
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
            if (self.messageTimeoutTimer) clearTimeout(self.messageTimeoutTimer);

            self.currentData = self.protocol.handleMessage(self.currentData);
            if (!self.protocol.isProcessComplete()) {
                var messagesToSend = self.protocol.messagesToSend();
                if (self.options.debug === 2) self.options.logger('MESSAGES TO SEND: ' + messagesToSend);
                for (var i = 0; i< messagesToSend; i++) {
                    var nextData = self.protocol.getNextMessage(this);
                    if (typeof nextData === 'string' || typeof nextData === 'object') {
                        if (nextData.length > 0) this.write(nextData);
                        self.serialComm.flush();
                    }
                }
                if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportSerialMessageTimeout);
                self.messageTimeoutTimer = setTimeout(function() {
                    self.handleSerialTimeout();
                }, self.options.transportSerialMessageTimeout);
            }
            if (self.protocol.isProcessComplete()) {
                if (self.messageTimeoutTimer) clearTimeout(self.messageTimeoutTimer);
                if (self.options.debug === 2) self.options.logger('SCHEDULE NEXT RUN IN ' + self.options.requestInterval + 's');
                this.close();
                if (!self.stopRequests) {
                    self.requestTimer = setTimeout(function() {
                        self.protocol.initState(); // reset Protocol instance because it will be a new session
                        self.process(); // and open port again
                    }, self.options.requestInterval*1000);
                }
            }
            if (self.options.debug === 2 && self.currentData) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + self.currentData.toString());
        }
        else if (self.currentData.length > self.options.transportSerialMaxBufferSize) {
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
        if (self.options.debug !== 0) self.options.logger('SERIALPORT DISCONNECTED: ' + err);
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

SerialRequestResponseTransport.prototype.process = function process(callback) {
    this.protocol.initState();
    this.currentData = null;
    var self = this;
    this.serialComm.open(function() {
        if (self.options.debug === 2) self.options.logger('SERIALPORT RESET BAUDRATE TO ' + self.options.transportSerialBaudrate);
        self.serialComm.update({baudrate: self.options.transportSerialBaudrate}, function() {
            var messagesToSend = self.protocol.messagesToSend();
            if (self.options.debug === 2) self.options.logger('INITIAL MESSAGES TO SEND: ' + messagesToSend);
            for (var i = 0; i< messagesToSend; i++) {
                self.serialComm.write(self.protocol.getNextMessage());
                self.serialComm.flush();
            }
            if (self.messageTimeoutTimer) clearTimeout(self.messageTimeoutTimer);
            if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportSerialMessageTimeout);
            self.messageTimeoutTimer = setTimeout(function() {
                self.handleSerialTimeout();
            }, self.options.transportSerialMessageTimeout);
        });
    });
};

SerialRequestResponseTransport.prototype.stop = function stop() {
    this.stopRequests = true;
    if (this.requestTimer) clearTimeout(this.requestTimer);
    if (this.messageTimeoutTimer) clearTimeout(this.messageTimeoutTimer);
    var self = this;
    if (this.serialComm) {
        this.serialComm.close(function() {
            self.serialComm = null;
        });
    }
};

SerialRequestResponseTransport.prototype.handleSerialTimeout = function handleSerialTimeout() {
    if (this.options.debug === 2) this.options.logger('MESSAGE TIMEOUT TRIGGERED');
    this.stop();
    throw new Error('No answer from Serial Device after last request.');
};

module.exports = SerialRequestResponseTransport;
