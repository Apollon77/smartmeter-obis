var fs = require('fs');

function LocalFileTransport(options, protocol) {
    this.options = options;
    this.protocol = protocol;

    this.requestTimer = null;
}

LocalFileTransport.prototype.init = function init() {
    this.protocol.initState(); // init State from protocol instance
};

LocalFileTransport.prototype.process = function process() {
    var self = this;
    if (fs.existsSync(this.options.transportLocalFilePath)) {
        fs.readFile(this.options.transportLocalFilePath, function (error, data) {
            if (!error ) {
                data = data.toString('hex');
                if (self.protocol.checkMessage(data)) {
                    self.protocol.handleMessage(data);
                    if (self.protocol.isProcessComplete()) {
                        self.requestTimer = setTimeout(function() {
                            self.protocol.initState(); // reset Protocol instance because it will be a new session
                            self.process(); // and open port again
                        }, self.options.requestInterval*1000);
                    }
                }
            }
        });
    }
};

module.exports = LocalFileTransport;
