/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var request = require('request');

function HttpRequestTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;

    this.requestTimer = null;
    this.stopRequests = false;

    if (!this.options.transportHttpRequestTimeout) this.options.transportHttpRequestTimeout = 2000;
    var self = this;
    this.protocol.setTransportResetCallback(function() {
    });
}

HttpRequestTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance
};

HttpRequestTransport.prototype.process = function process() {
    var self = this;
    request({'url': this.options.transportHttpRequestUrl, 'timeout': this.options.transportHttpRequestTimeout}, function (error, response, body) {
        if (!error && response && response.statusCode === 200) {
            try {
                body = Buffer.from(body);
            } catch (e) {
                if (self.options.debug === 2) self.options.logger('CAN NOT ALLOCATE MEMORY! STOPPING');
                self.stop();
                return;
            }
            var counter = 0;
            while (body && body.length > 0 && (counter === 0 || !self.protocol.isProcessComplete())) {
                if (self.protocol.checkMessage(body)) {
                    body = self.protocol.handleMessage(body);
                    if (self.options.debug === 2 && body) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + body);
                } else {
                    self.protocol.callUserCallback(new Error('Received Message do not match protocol: ' + body), null);
                }
                counter++;
            }
        }
        else {
            self.options.logger('ERROR ON HTTP REQUEST: ' + (response ? response.statusCode : '') + ': ' + error);
        }
        if (self.protocol.isProcessComplete() && !self.stopRequests) {
            if (self.options.requestInterval >= 0) {
                if (self.options.debug === 2) self.options.logger('SCHEDULE NEXT RUN IN ' + self.options.requestInterval + 's');
                self.requestTimer = setTimeout(function() {
                    self.protocol.initState(); // reset Protocol instance because it will be a new session
                    self.process(); // and open port again
                }, self.options.requestInterval*1000);
            }
            else {
                self.stop();
            }
        }
    });
};

HttpRequestTransport.prototype.stop = function stop(callback) {
    this.stopRequests = true;
    if (this.requestTimer) clearTimeout(this.requestTimer);
    if (callback) callback();
};

module.exports = HttpRequestTransport;
