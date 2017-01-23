var request = require('request');

function HttpRequestTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;

    this.requestTimer = null;
}

HttpRequestTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance
};

HttpRequestTransport.prototype.process = function process() {
    var self = this;
    request({url: this.options.transportHttpRequestUrl, timeout: 2000}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (self.protocol.checkMessage(body)) {
                self.protocol.handleMessage(body);
                if (self.protocol.isProcessComplete()) {
                    self.requestTimer = setTimeout(function() {
                        self.protocol.initState(); // reset Protocol instance because it will be a new session
                        self.process(); // and open port again
                    }, self.options.requestInterval*1000);
                }
            }
        }
    });
};

module.exports = HttpRequestTransport;
