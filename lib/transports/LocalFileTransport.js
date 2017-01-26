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
                var counter = 0;
                while (data && data.length > 0 && (counter === 0 || !self.protocol.isProcessComplete())) {
                    if (self.protocol.checkMessage(data)) {
                        data = self.protocol.handleMessage(data);
                        if (self.options.debug === 2 && data) self.options.logger('REMAINING DATA AFTER MESSAGE HANDLING: ' + data);
                    }
                    else {
                        throw Error('Received Message do not match protocol: ' + data);
                    }
                    counter++;
                }
                if (self.protocol.isProcessComplete()) {
                    self.requestTimer = setTimeout(function() {
                        if (self.options.debug === 2) self.options.logger('SCHEDULE NEXT RUN IN ' + self.options.requestInterval + 's');
                        self.protocol.initState(); // reset Protocol instance because it will be a new session
                        self.process(); // and open port again
                    }, self.options.requestInterval*1000);
                }
            }
        });
    }
};

module.exports = LocalFileTransport;
