/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

function StdInTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;
    this.stdInStream = undefined;

    this.requestTimer = null;
    this.stopRequests = false;
    this.currentData = null;
    this.currentDataOffset = 0;
    this.messageTimeoutTimer = null;

    if (!this.options.transportStdInMaxBufferSize) this.options.transportStdInMaxBufferSize = 300000;
    if (!this.options.transportStdInMessageTimeout) this.options.transportStdInMessageTimeout = 120000;

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

StdInTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance

    var self = this;
    if (!this.stdInStream) {
        this.stdInStream = process.stdin;
        if (this.options.debug === 2) this.options.logger('ASSIGN STDIN');

        this.stdInStream.on('data', function (data) {
            if (!data || !Buffer.isBuffer(data)) return;
            if (self.stopRequests) {
                if (self.options.debug === 2) self.options.logger('NEW DATA AFTER STOP ... ignore');
                return;
            }

            if (! self.currentData) {
                try {
                    self.currentData = Buffer.alloc(self.options.transportStdInMaxBufferSize, 0);
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
                bufferOverrun = true;
                self.currentDataOffset = self.options.transportSerialMaxBufferSize;
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

        this.stdInStream.on('error', function (msg) {
            if (self.options.debug !== 0) self.options.logger('STDIN ERROR: ' + msg);
            self.currentData = null;
            self.currentDataOffset = 0;
        });

        this.stdInStream.on('end', function () {
            if (self.options.debug !== 0) self.options.logger('STDIN END');
            self.stop();
        });
    }

    this.currentData = null;
    this.currentDataOffset = 0;
};

StdInTransport.prototype.processData = function processData() {
    var self = this;
    if (!self.currentData || self.currentData.length === 0) return false;

    if (self.protocol.checkMessage(self.currentData.slice(0, self.currentDataOffset))) {
        if (self.messageTimeoutTimer) {
            clearTimeout(self.messageTimeoutTimer);
            self.messageTimeoutTimer = null;
        }

        if (self.options.debug === 2) self.options.logger('PAUSE READING STDIN TO HANDLE MESSAGE');
        self.stdInStream.pause();
        var addData = self.protocol.handleMessage(self.currentData.slice(0, self.currentDataOffset));

        try {
            self.currentData = Buffer.alloc(self.options.transportStdInMaxBufferSize, 0);
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
                self.options.logger('StdInTransport do not support sending of Data! Ignore them');
            }
        }
        if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportStdInMessageTimeout);
        if (self.messageTimeoutTimer) {
            clearTimeout(self.messageTimeoutTimer);
            self.messageTimeoutTimer = null;
        }
        self.messageTimeoutTimer = setTimeout(function() {
            self.messageTimeoutTimer = null;
            self.handleStdInTimeout();
        }, self.options.transportStdInMessageTimeout);

        if (self.options.debug === 2) self.options.logger('RESUME READING STDIN');
        if (self.stdInStream && !self.stopRequests) self.stdInStream.resume(); // we want to read continously

        if (self.protocol.isProcessComplete()) {
            if (self.options.requestInterval !==0 ) {
                if (self.messageTimeoutTimer) {
                    clearTimeout(self.messageTimeoutTimer);
                    self.messageTimeoutTimer = null;
                }
                self.scheduleNextRun();
            }
        }
        if (self.options.debug === 2 && self.currentData) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + self.currentData.slice(0, self.currentDataOffset).toString());
        return true;
    }
    return false;
};

StdInTransport.prototype.scheduleNextRun = function scheduleNextRun() {
    if (!this.stopRequests) {
        if (this.requestTimer) {
            clearTimeout(this.requestTimer);
            this.requestTimer = null;
        }
        if (this.options.requestInterval > 0) {
            if (this.options.debug === 2 && this.currentDataOffset > 0) this.options.logger('DELETE rest of data (' + this.currentDataOffset + ')');
            this.currentData = null;
            this.currentDataOffset = 0;
            if (this.stdInStream) this.stdInStream.pause();
        }
        else if (this.options.requestInterval < 0) {
            if (this.options.debug === 2) this.options.logger('STOP because requestInterval < 0');
            this.stop();
            return;
        }

        var self = this;
        this.requestTimer = setTimeout(function() {
            self.requestTimer = null;
            if (!self.stdInStream) self.init();
                else self.protocol.initState(); // reset Protocol instance because it will be a new session
            self.process(); // and open port again
        }, this.options.requestInterval*1000);
        if (this.options.debug === 2) this.options.logger('SCHEDULE NEXT RUN IN ' + this.options.requestInterval + 's');
    }
    else {
        if (this.stdInStream) this.stdInStream.pause();
    }
};

StdInTransport.prototype.process = function process() {
    this.currentData = null;
    this.currentDataOffset = 0;
    var self = this;
    if (self.options.debug === 2) self.options.logger('STDIN RESUME');
    self.currentData = null;
    self.currentDataOffset = 0;

    self.stdInStream.resume();
    if (self.messageTimeoutTimer) {
        clearTimeout(self.messageTimeoutTimer);
        self.messageTimeoutTimer = null;
    }
    if (self.options.debug === 2) self.options.logger('SET MESSAGE TIMEOUT TIMER: ' + self.options.transportStdInMessageTimeout);
    self.messageTimeoutTimer = setTimeout(function() {
        self.messageTimeoutTimer = null;
        self.handleStdInTimeout();
    }, self.options.transportStdInMessageTimeout);
};

StdInTransport.prototype.stop = function stop(callback) {
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
    if (self.stdInStream) {
        self.stdInStream.pause();
        self.currentData = null;
        self.currentDataOffset = 0;
        if (this.stopRequests) {
            self.stdInStream.removeAllListeners();
        }
    }
    if (callback) callback();
};

StdInTransport.prototype.handleStdInTimeout = function handleStdInTimeout() {
    if (this.options.debug === 2) this.options.logger('MESSAGE TIMEOUT TRIGGERED');
    this.protocol.callUserCallback(new Error('No or too long answer from StdIn after last request.'), null);
};

module.exports = StdInTransport;
