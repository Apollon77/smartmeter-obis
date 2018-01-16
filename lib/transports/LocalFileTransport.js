/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var fs = require('fs');

function LocalFileTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;

    this.requestTimer = null;
    this.stopRequests = false;

    var self = this;
    this.protocol.setTransportResetCallback(function() {
    });
}

LocalFileTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance
};

LocalFileTransport.prototype.process = function process() {
    var self = this;
    if (fs.existsSync(this.options.transportLocalFilePath)) {
        fs.readFile(this.options.transportLocalFilePath, function (error, data) {
            if (!error ) {
                var counter = 0;
                while (data && data.length > 0 && (counter === 0 || !self.protocol.isProcessComplete())) {
                    if (self.protocol.checkMessage(data)) {
                        data = self.protocol.handleMessage(data);
                        if (self.options.debug === 2 && data) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + data);
                    }
                    else {
                        self.protocol.callUserCallback(new Error('Received Message do not match protocol: ' + data), null);
                    }
                    counter++;
                }
            }
            else  {
                self.protocol.callUserCallback(error, null);
            }
            if (self.protocol.isProcessComplete() && !self.stopRequests) {
                if (self.options.requestInterval >= 0) {
                    self.requestTimer = setTimeout(function() {
                        if (self.options.debug === 2) self.options.logger('SCHEDULE NEXT RUN IN ' + self.options.requestInterval + 's');
                        self.protocol.initState(); // reset Protocol instance because it will be a new session
                        self.process(); // and open port again
                    }, self.options.requestInterval * 1000);
                }
                else {
                    self.stop();
                }
            }
        });
    }
    else  {
        self.protocol.callUserCallback(new Error('File does not exist'), null);
        if (self.protocol.isProcessComplete() && !self.stopRequests) {
            self.requestTimer = setTimeout(function() {
                if (self.options.debug === 2) self.options.logger('SCHEDULE NEXT RUN IN ' + self.options.requestInterval + 's');
                self.protocol.initState(); // reset Protocol instance because it will be a new session
                self.process(); // and open port again
            }, self.options.requestInterval*1000);
        }
    }
};

LocalFileTransport.prototype.stop = function stop(callback) {
    this.stopRequests = true;
    if (this.requestTimer) clearTimeout(this.requestTimer);
    if (callback) callback();
};

module.exports = LocalFileTransport;
