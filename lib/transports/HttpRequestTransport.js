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
            body = new Buffer(body);
            var counter = 0;
            while (body && body.length > 0 && (counter === 0 || !self.protocol.isProcessComplete())) {
                if (self.protocol.checkMessage(body)) {
                    body = self.protocol.handleMessage(body);
                    //console.log("REST DATA: " + body);
                }
                else {
                    break; // can not be fixed
                }
                counter++;
            }
            if (self.protocol.isProcessComplete()) {
                self.requestTimer = setTimeout(function() {
                    self.protocol.initState(); // reset Protocol instance because it will be a new session
                    self.process(); // and open port again
                }, self.options.requestInterval*1000);
            }
        }
});
};

module.exports = HttpRequestTransport;
