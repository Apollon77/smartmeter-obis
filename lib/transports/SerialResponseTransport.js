/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var SerialPort = require('serialport');

function SerialResponseTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;
    this.serialConnected = false;
    this.serialComm = undefined;

    this.requestTimer = null;
    this.stopRequests = false;
    this.currentData = null;
    this.currentDataOffset = 0;
    this.messageTimeoutTimer = null;

    if (!this.options.transportSerialBaudrate) this.options.transportSerialBaudrate = 9600;
    if (!this.options.transportSerialDataBits) this.options.transportSerialDataBits = 8;
    if (!this.options.transportSerialStopBits) this.options.transportSerialStopBits = 1;
    if (!this.options.transportSerialParity) this.options.transportSerialParity = 'none';
    if (!this.options.transportSerialMaxBufferSize) this.options.transportSerialMaxBufferSize = 300000;
    if (!this.options.transportSerialMessageTimeout) this.options.transportSerialMessageTimeout = 120000;

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

SerialResponseTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance

    var self = this;
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

        this.serialComm.on('data', function (data) {
            if (!data || !Buffer.isBuffer(data)) return;
            if (!self.serialComm) return;
            if (self.stopRequests) {
                if (self.options.debug === 2) self.options.logger('NEW DATA AFTER STOP ... ignore');
                return;
            }

            if (! self.currentData) {
                try {
                    self.currentData = Buffer.alloc(self.options.transportSerialMaxBufferSize, 0);
                } catch (e) {
                    if (self.options.debug === 2) self.options.logger('CAN NOT ALLOCATE MEMORY! STOPPING');
                    self.stop();
                    return;
                }
            }
            if (data.length > 0) {
                if (self.options.debug === 2) self.options.logger('ADD NEW DATA (' + self.currentDataOffset + ' + NEW ' + data.length + ')');
                data.copy(self.currentData, self.currentDataOffset);
                self.currentDataOffset += data.length;
            }
            var bufferOverrun = false;
            if (self.currentDataOffset > self.options.transportSerialMaxBufferSize) {
                if (self.options.debug === 2) self.options.logger('BUFFER OVERRUN DETECTED, Try to Process anyway (' + self.currentDataOffset + ' vs. ' + self.options.transportSerialMaxBufferSize + ')');
                self.currentDataOffset = self.options.transportSerialMaxBufferSize;
                bufferOverrun = true;
            }
            while (self.processData() && self.currentDataOffset > 0) {
                if (self.options.debug === 2 && self.currentDataOffset > 0) self.options.logger('MORE DATA AVAILABLE, PROCESS THEM ' + self.currentDataOffset);
                if (bufferOverrun && !self.protocol.checkMessageAfterBufferOverrun()) break;
            }
            if (self.currentDataOffset === self.options.transportSerialMaxBufferSize) {
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
    }

    this.currentData = null;
    this.currentDataOffset = 0;
};

SerialResponseTransport.prototype.processData = function processData() {
    var self = this;
    if (!self.currentData || self.currentData.length === 0) return false;
    if (self.protocol.checkMessage(self.currentData.slice(0, self.currentDataOffset))) {
        if (self.messageTimeoutTimer) {
            clearTimeout(self.messageTimeoutTimer);
            self.messageTimeoutTimer = null;
        }

        if (self.options.debug === 2) self.options.logger('PAUSE READING SERIALPORT TO HANDLE MESSAGE');
        if (self.stopRequests || !self.serialComm) return false;
        self.serialComm.pause();
        var addData = self.protocol.handleMessage(self.currentData.slice(0, self.currentDataOffset));

        try {
            self.currentData = Buffer.alloc(self.options.transportSerialMaxBufferSize, 0);
        } catch (e) {
            if (self.options.debug === 2) self.options.logger('CAN NOT ALLOCATE MEMORY! STOPPING');
            self.stop();
            return;
        }

        self.currentDataOffset = 0;
        if (addData && addData.length > 0) {
            addData.copy(self.currentData, 0);
            self.currentDataOffset = addData.length;
            if (self.options.debug === 2) self.options.logger('LEFT AFTER HANDLE-MESSAGE ' + self.currentDataOffset);
        }
        if (!self.protocol.isProcessComplete()) {
            if (self.protocol.messagesToSend() > 0 && self.options.debug === 2) {
                self.options.logger('SerialResponseTransport do not support sending of Data! Ignore them');
            }
        }
        if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportSerialMessageTimeout);
        if (self.messageTimeoutTimer) {
            clearTimeout(self.messageTimeoutTimer);
            self.messageTimeoutTimer = null;
        }
        self.messageTimeoutTimer = setTimeout(function() {
            self.messageTimeoutTimer = null;
            self.handleSerialTimeout();
        }, self.options.transportSerialMessageTimeout);

        if (self.options.debug === 2) self.options.logger('RESUME READING SERIALPORT');
        if (self.serialComm && !self.stopRequests) self.serialComm.resume(); // we want to read continously

        if (self.protocol.isProcessComplete()) {
            if (self.messageTimeoutTimer) {
                clearTimeout(self.messageTimeoutTimer);
                self.messageTimeoutTimer = null;
            }
            self.scheduleNextRun();
        }
        if (self.options.debug === 2 && self.currentData) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + self.currentDataOffset);
        return true;
    }
    return false;
};

SerialResponseTransport.prototype.scheduleNextRun = function scheduleNextRun() {
    var self = this;
    if (!this.stopRequests) {
        if (this.requestTimer) {
            clearTimeout(this.requestTimer);
            this.requestTimer = null;
        }
        if (this.options.requestInterval > 0) {
            if (this.options.debug === 2 && this.currentDataOffset > 0) this.options.logger('DELETE rest of data (' + this.currentDataOffset + ')');
            this.currentData = null;
            this.currentDataOffset = 0;
            if (this.serialComm && this.serialConnected && this.serialComm.isOpen) this.serialComm.close(function(err) {
                if (err) {
                    self.options.logger('ERROR CLOSING SERIALPORT: ' + err);
                }
            });
        }
        else if (this.options.requestInterval < 0) {
            if (this.options.debug === 2) this.options.logger('STOP because requestInterval < 0');
            this.stop();
            return;
        }

        this.requestTimer = setTimeout(function() {
            self.requestTimer = null;
            if (!self.serialComm) self.init();
                else self.protocol.initState(); // reset Protocol instance because it will be a new session
            self.process(); // and open port again
        }, this.options.requestInterval*1000);
        if (this.options.debug === 2) this.options.logger('SCHEDULE NEXT RUN IN ' + this.options.requestInterval + 's');
    }
    else {
        if (this.serialComm && this.serialComm.isOpen) this.serialComm.close(function(err) {
            if (err) {
                self.options.logger('ERROR CLOSING SERIALPORT: ' + err);
            }
        });
    }
};

SerialResponseTransport.prototype.process = function process() {
    var self = this;
    function startIt() {
        if (self.messageTimeoutTimer) {
            clearTimeout(self.messageTimeoutTimer);
            self.messageTimeoutTimer = null;
        }
        if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportSerialMessageTimeout);
        self.messageTimeoutTimer = setTimeout(function() {
            self.messageTimeoutTimer = null;
            self.handleSerialTimeout();
        }, self.options.transportSerialMessageTimeout);
    }

    if (this.options.requestInterval !== 0 || (this.serialComm && !this.serialComm.isOpen)) {
        this.currentData = null;
        this.currentDataOffset = 0;
        this.serialComm.open(function() {
            if (self.stopRequests || !self.serialComm) return;
            self.serialComm.flush(function () {
                startIt();
            });
        });
    }
    else {
        startIt();
    }
};

SerialResponseTransport.prototype.stop = function stop(callback) {
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
    if (this.serialComm && this.serialComm.isOpen) {
        this.serialComm.close(function(err) {
            if (err) {
                self.options.logger('ERROR CLOSING SERIALPORT: ' + err);
            }
            self.serialComm = null;
            if (callback) callback();
        });
    }
    else {
        self.serialComm = null;
        if (callback) callback();
    }
};

SerialResponseTransport.prototype.handleSerialTimeout = function handleSerialTimeout() {
    if (this.options.debug === 2) this.options.logger('MESSAGE TIMEOUT TRIGGERED');
    this.protocol.callUserCallback(new Error('No or too long answer from Serial Device after last request.'), null);
};

module.exports = SerialResponseTransport;
