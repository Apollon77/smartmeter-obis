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
                        //console.log("REST DATA: " + data);
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
    }
};

module.exports = LocalFileTransport;
