/* jshint -W097 */
// jshint strict:false
/*jslint node: true */

'use strict';

var events = require('events');
var util = require('util');

var VirtualSerialPort = function(options, callback) {
    events.EventEmitter.call(this);

    var self = this;

    this.options = options;

    this.isOpen = false;
    this.paused = false;
    this.delayedData = [];
    this.writeToComputer = function(data) {
        if (self.paused) {
            self.delayedData.push(data);
        }
        else if (!this.isOpen) {
            console.warn('VirtualSerialPort - Discard data write because port not isOpen');
        }
        else {
        self.emit('data', data);
        }
    };

    if (options && options.autoOpen !== false) {
        process.nextTick(function() {
            self.open(callback);
        });
    }
};

util.inherits(VirtualSerialPort, events.EventEmitter);

VirtualSerialPort.prototype._error = function(error, callback) {
    if (callback) {
        callback.call(this, error);
    } else {
        this.emit('error', error);
    }
};

VirtualSerialPort.prototype._asyncError = function(error, callback) {
    process.nextTick(function() { this._error(error, callback); }.bind(this));
};

VirtualSerialPort.prototype.open = function open(callback) {
    if (this.isOpen) {
        return this._asyncError(new Error('Port is already open'));
    }

    this.isOpen = true;

    process.nextTick(
        function() {
            this.emit('open');
        }.bind(this)
    );

    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.write = function write(buffer, callback) {
    if (this.isOpen) {
        process.nextTick(
            function() {
                this.emit('dataToDevice', buffer);
            }.bind(this)
        );
    }
    // This callback should receive both an error and result, however result is
    // undocumented so I do not know what it should contain
    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.pause = function pause() {
    this.paused = true;
};

VirtualSerialPort.prototype.resume = function resume() {
    this.paused = false;

    var self = this;
    function sendDelayedData() {
        if (self.delayedData.length === 0 || self.paused) return;
        var data = self.delayedData.shift();
        self.writeToComputer(data);
        setTimeout(sendDelayedData, 0);
    }
    sendDelayedData();
};

VirtualSerialPort.prototype.flush = function flush(callback) {
    this.delayedData = [];
    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.drain = function drain(callback) {
    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.close = function close(callback) {
    this.isOpen = false;

    process.nextTick(
        function() {
            this.emit('close');
        }.bind(this)
    );

    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.pipe = function pipe(options, callback) {
    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.update = function update(options, callback) {
    if (callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.isOpen = function isOpen() {
    return this.isOpen;
};

function VirtualSerialPortFactory() {
    try {
        var { SerialPort } = require('serialport');
        VirtualSerialPort.parsers = SerialPort.parsers;

        return {
            SerialPort: VirtualSerialPort
        }
    } catch (error) {
        console.warn('VirtualSerialPort - NO parsers available');
    }

    return {
        SerialPort: VirtualSerialPort
    }
}

module.exports = new VirtualSerialPortFactory();
