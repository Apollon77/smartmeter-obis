/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var SerialPort = require('serialport');

function SerialRequestResponseTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;
    this.serialConnected = false;
    this.serialComm = undefined;

    this.requestTimer = null;
    this.stopRequests = false;
    this.currentData = null;
    this.currentDataOffset = 0;
    this.messageTimeoutTimer = null;

    if (!this.options.transportSerialBaudrate) this.options.transportSerialBaudrate = 300;
    if (!this.options.transportSerialDataBits) this.options.transportSerialDataBits = 7;
    if (!this.options.transportSerialStopBits) this.options.transportSerialStopBits = 1;
    if (!this.options.transportSerialParity) this.options.transportSerialParity = 'even';
    if (!this.options.transportSerialMaxBufferSize) this.options.transportSerialMaxBufferSize = 300000;
    if (!this.options.transportSerialMessageTimeout) this.options.transportSerialMessageTimeout = 120000;
    if (!this.options.anotherQueryDelay) this.options.anotherQueryDelay = 1000;
    if (this.options.anotherQueryDelay < 500) this.options.anotherQueryDelay = 500;

    var self = this;
    this.protocol.setTransportResetCallback(function(res) {
        if (self.options.debug === 2) self.options.logger('Transport Reset!! Restart = ' + !self.stopRequests);
        if (!self.stopRequests) {
            self.stop(function() {
                self.stopRequests = false;
                self.scheduleNextRun();
            });
        }
    });
}

SerialRequestResponseTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance

    if (!this.serialComm) {
        this.serialComm = new SerialPort(this.options.transportSerialPort, {
            autoOpen:   false,
            baudRate:   this.options.transportSerialBaudrate,
            dataBits:   this.options.transportSerialDataBits,
            stopBits:   this.options.transportSerialStopBits,
            parity:     this.options.transportSerialParity,
            highWaterMark: 2048
        });
        if (this.options.debug === 2) this.options.logger('CREATE SERIALPORT: ' + this.options.transportSerialBaudrate + ' '  + this.options.transportSerialDataBits + ' '  + this.options.transportSerialStopBits + ' '  + this.options.transportSerialParity);
    }
    var self = this;
    this.serialComm.on('data', function (data) {
        if (self.options.debug === 2) self.options.logger('NEW DATA');
        if (self.stopRequests) {
            if (self.options.debug === 2) self.options.logger('NEW DATA AFTER STOP ... ignore');
            return;
        }
        if (! self.currentData) {
            if (Buffer.alloc) { // Node 6+
                self.currentData = Buffer.alloc(self.options.transportSerialMaxBufferSize);
            }
            else {
                self.currentData = new Buffer(self.options.transportSerialMaxBufferSize).fill(0);
            }
        }
        if (data.length > 0) {
            data.copy(self.currentData, self.currentDataOffset);
            self.currentDataOffset += data.length;
        }
        var bufferOverrun = false;
        if (self.currentDataOffset > self.options.transportSerialMaxBufferSize) {
            if (self.options.debug === 2) self.options.logger('BUFFER OVERRUN DETECTED, Try to Process anyway (' + self.currentDataOffset + ' vs. ' + self.options.transportSerialMaxBufferSize + ')');
            bufferOverrun = true;
        }
        if (bufferOverrun && !self.protocol.checkMessageAfterBufferOverrun()) {
            if (self.options.debug === 2) self.options.logger('DELETE all data (' + self.currentDataOffset + ') because of Buffer overrun missed data');
            self.currentData = null;
            self.currentDataOffset = 0;
            return;
        }

        if (self.protocol.checkMessage(self.currentData.slice(0, self.currentDataOffset))) {
            if (self.options.debug === 2) self.options.logger('PAUSE READING SERIALPORT TO HANDLE MESSAGE');
            if (process.platform !== 'win32'){
                self.serialComm.pause();
            }
            if (self.messageTimeoutTimer) {
                clearTimeout(self.messageTimeoutTimer);
                self.messageTimeoutTimer = null;
            }

            var addData = self.protocol.handleMessage(self.currentData.slice(0, self.currentDataOffset));
            if (self.options.debug === 2) self.options.logger('LEFT AFTER HANDLE-MESSAGE ' + addData.length);
            if (Buffer.alloc) { // Node 6+
                self.currentData = Buffer.alloc(self.options.transportSerialMaxBufferSize);
            }
            else {
                self.currentData = new Buffer(self.options.transportSerialMaxBufferSize).fill(0);
            }
            self.currentDataOffset = 0;
            if (addData && addData.length > 0) {
                addData.copy(self.currentData, 0);
                self.currentDataOffset = addData.length;
            }
            if (!self.protocol.isProcessComplete()) {
                var messagesToSend = self.protocol.messagesToSend();
                if (self.options.debug === 2) self.options.logger('MESSAGES TO SEND: ' + messagesToSend);

                setTimeout(function() {
                    sendOutMessages(messagesToSend);
                }, 250);
            }
            else {
                finalizeMessageHandling();
            }

            function sendOutMessages(messagesToSend) {
                if (messagesToSend > 0) {
                    self.protocol.getNextMessage(self.serialComm, function(nextData) {
                        if (self.options.debug === 2) self.options.logger('TO SEND ' + messagesToSend + ': ' + nextData);
                        if (typeof nextData === 'string' || typeof nextData === 'object') {
                            if (nextData.length > 0) {
                                self.serialComm.write(nextData, function () {
                                    self.serialComm.drain(function() {
                                        if (self.options.debug === 2) self.options.logger('DONE SEND ' + messagesToSend);
                                        setTimeout(function() {
                                            sendOutMessages(--messagesToSend);
                                        }, 250);
                                    });
                                });
                                return;
                            }
                        }
                        sendOutMessages(--messagesToSend);
                    });
                }
                else {
                    if (self.options.debug === 2) self.options.logger('DONE SEND ' + messagesToSend);
                    finalizeMessageHandling();
                }
            }

            function finalizeMessageHandling() {
                if (self.options.debug === 2) self.options.logger('RESUME READING SERIALPORT');
                if (self.serialComm && !self.stopRequests) self.serialComm.resume(); // we want to read continously

                if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportSerialMessageTimeout);
                if (self.messageTimeoutTimer) {
                    clearTimeout(self.messageTimeoutTimer);
                    self.messageTimeoutTimer = null;
                }
                self.messageTimeoutTimer = setTimeout(function() {
                    self.messageTimeoutTimer = null;
                    self.handleSerialTimeout();
                }, self.options.transportSerialMessageTimeout);
                if (self.protocol.isProcessComplete()) {
                    if (self.messageTimeoutTimer) {
                        clearTimeout(self.messageTimeoutTimer);
                        self.messageTimeoutTimer = null;
                    }
                    if (self.serialComm) {
                        self.serialComm.close(function(err) {
                            if (err) {
                                self.options.logger('ERROR CLOSING SERIALPORT');
                            }
                            self.scheduleNextRun();
                        });
                    }
                    else {
                        self.scheduleNextRun();
                    }
                }
                if (self.options.debug === 2 && self.currentData) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + self.currentData.slice(0, self.currentDataOffset).toString());
            }
        }
        else if (self.currentDataOffset === self.options.transportSerialMaxBufferSize) {
            self.protocol.callUserCallback(new Error('Maximal Buffer size reached without matching message : ' + self.currentData.toString()), null);
            if (self.options.debug === 2) self.options.logger('DELETE all data (' + self.currentDataOffset + ')');
            self.currentData = null;
            self.currentDataOffset = 0;
        }
        else if (bufferOverrun) {
            if (self.options.debug === 2) self.options.logger('DELETE all data (' + self.currentDataOffset + ') because of Buffer overrun missed data');
            self.currentData = null;
            self.currentDataOffset = 0;
        }

    });

    this.serialComm.on('error', function (msg) {
        if (self.options.debug !== 0) self.options.logger('SERIALPORT ERROR: ' + msg);
        self.serialConnected = false;
        self.currentData = null;
        self.currentDataOffset = 0;
    });

    this.serialComm.on('open', function () {
        if (self.options.debug === 2) self.options.logger('SERIALPORT OPEN');
        self.serialConnected = true;
        self.currentData = null;
        self.currentDataOffset = 0;
    });

    this.serialComm.on('disconnect', function (err) {
        if (self.options.debug !== 0) self.options.logger('SERIALPORT DISCONNECTED: ' + err);
        self.serialConnected = false;
        self.currentData = null;
        self.currentDataOffset = 0;
    });

    this.serialComm.on('close', function () {
        if (self.options.debug === 2) self.options.logger('SERIALPORT CLOSE');
        self.serialConnected = false;
        self.currentData = null;
        self.currentDataOffset = 0;
        if (this.stopRequests) {
            self.serialComm.removeAllListeners();
        }
    });

    this.currentData = null;
    this.currentDataOffset = 0;
};

SerialRequestResponseTransport.prototype.scheduleNextRun = function scheduleNextRun() {
    if (!this.stopRequests) {
        if (this.requestTimer) {
            clearTimeout(this.requestTimer);
            this.requestTimer = null;
        }
        var delay = this.options.requestInterval * 1000;
        if (this.protocol.anotherQueryAvailable()) {
            delay = this.options.anotherQueryDelay;
        }
        else if (this.options.requestInterval < 0) {
            if (this.options.debug === 2) this.options.logger('STOP because requestInterval < 0');
            this.stop();
            return;
        }
        if (this.options.debug === 2) this.options.logger('DELETE rest of data (' + this.currentDataOffset + ') because new Message start with a new Request Message');
        this.currentData = null;
        this.currentDataOffset = 0;

        if (this.options.debug === 2) this.options.logger('SCHEDULE NEXT RUN IN ' + this.options.requestInterval + 's');
        var self = this;
        this.requestTimer = setTimeout(function() {
            self.requestTimer = null;
            if (!self.serialComm) self.init();
                else self.protocol.initState(); // reset Protocol instance because it will be a new session
            self.process(); // and open port again
        }, delay);
    }
};

SerialRequestResponseTransport.prototype.process = function process() {
    this.protocol.initState();
    this.currentData = null;
    this.currentDataOffset = 0;
    var self = this;
    this.serialComm.open(function() {
        self.serialComm.flush(function() {
            if (self.options.debug === 2) self.options.logger('SERIALPORT RESET BAUDRATE TO ' + self.options.transportSerialBaudrate);
            self.serialComm.update({baudRate: self.options.transportSerialBaudrate}, function(error) {
                if (error) {
                    self.protocol.callUserCallback(new Error('Error on Baudrate changeover'), null);
                }
                var messagesToSend = self.protocol.messagesToSend();
                if (self.options.debug === 2) self.options.logger('INITIAL MESSAGES TO SEND: ' + messagesToSend);

                sendOutMessages(messagesToSend);

                function sendOutMessages(messagesToSend) {
                    if (messagesToSend > 0) {
                        self.protocol.getNextMessage(self.serialComm, function(nextData) {
                            if (self.options.debug === 2) self.options.logger('TO SEND ' + messagesToSend + ': ' + nextData);
                            if (typeof nextData === 'string' || typeof nextData === 'object') {
                                if (nextData.length > 0) {
                                    self.serialComm.write(nextData, function () {
                                        self.serialComm.drain(function() {
                                            if (self.options.debug === 2) self.options.logger('DONE SEND ' + messagesToSend);
                                            setTimeout(function() {
                                                sendOutMessages(--messagesToSend);
                                            }, 250);
                                        });
                                    });
                                    return;
                                }
                            }
                            sendOutMessages(--messagesToSend);
                        });
                    }
                    else {
                        if (self.options.debug === 2) self.options.logger('DONE SEND ' + messagesToSend);
                        finalizeMessageHandling();
                    }
                }

                function finalizeMessageHandling() {
                    if (self.messageTimeoutTimer) {
                        clearTimeout(self.messageTimeoutTimer);
                        self.messageTimeoutTimer = null;
                    }
                    if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER2: ' + self.options.transportSerialMessageTimeout);
                    self.messageTimeoutTimer = setTimeout(function() {
                        self.messageTimeoutTimer = null;
                        self.handleSerialTimeout();
                    }, self.options.transportSerialMessageTimeout);
                }
            });
        });
    });
};

SerialRequestResponseTransport.prototype.stop = function stop(callback) {
    this.stopRequests = true;
    if (this.requestTimer) {
        clearTimeout(this.requestTimer);
        this.requestTimer = null;
    }
    if (this.messageTimeoutTimer) {
        clearTimeout(this.messageTimeoutTimer);
        this.messageTimeoutTimer = null;
    }
    var self = this;
    if (this.serialComm) {
        this.serialComm.close(function(err) {
            if (err) {
                self.options.logger('ERROR CLOSING SERIALPORT');
            }
            self.serialComm = null;
            if (callback) callback();
        });
    }
};

SerialRequestResponseTransport.prototype.handleSerialTimeout = function handleSerialTimeout() {
    if (this.options.debug === 2) this.options.logger('MESSAGE TIMEOUT TRIGGERED');
    this.protocol.callUserCallback(new Error('No or too long answer from Serial Device after last request.'), null);
};

module.exports = SerialRequestResponseTransport;
