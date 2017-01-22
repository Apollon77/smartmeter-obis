'use strict';

var events = require('events');
var util = require('util');

var VirtualSerialPort = function(path, options, openImmediately, callback) {
    events.EventEmitter.call(this);

    var self = this;

    this.opened = false;
    this.writeToComputer = function(data) {
        self.emit('data', data);
    };

    if((openImmediately || typeof openImmediately === 'undefined' || openImmediately === null) && (options.autoOpen || typeof options.autoOpen === 'undefined' || options.autoOpen === null)) {
        process.nextTick(function() {
            self.open(callback);
        });
    }
};

util.inherits(VirtualSerialPort, events.EventEmitter);

VirtualSerialPort.prototype.open = function open(callback) {
    this.opened = true;
    process.nextTick(function() {
        this.emit('open');
    }.bind(this));

    if(callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.write = function write(buffer, callback) {
    if(this.opened) {
        process.nextTick(function() {
            this.emit("dataToDevice", buffer);
        }.bind(this));
    }
    // This callback should receive both an error and result, however result is
    // undocumented so I do not know what it should contain
    if(callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.pause = function pause() {};

VirtualSerialPort.prototype.resume = function resume() {};

VirtualSerialPort.prototype.flush = function flush(callback) {
    if(callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.drain = function drain(callback) {
    if(callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.close = function close(callback) {
    //this.removeAllListeners();
    this.opened = false;

    process.nextTick(function() {
        this.emit('close');
    }.bind(this));

    if(callback) {
        return callback();
    }
};

VirtualSerialPort.prototype.update = function update(options) {};

VirtualSerialPort.prototype.isOpen = function isOpen() {
    return this.opened;
};

function VirtualSerialPortFactory() {
    try {
        var SerialPort = require('serialport');
        var serialportPackage = require('serialport/package.json');
        var semver = require('semver');

        // for v2.x serialport API
        if(semver.satisfies(serialportPackage.version, '<3.X')) {
            this.SerialPort = VirtualSerialPort;
            this.parsers = SerialPort.parsers;
            return this;
        }

        VirtualSerialPort.parsers = SerialPort.parsers;
        return VirtualSerialPort;
    } catch (error) {
        console.warn('VirtualSerialPort - NO parsers available');
    }

    return VirtualSerialPort;
}

module.exports = new VirtualSerialPortFactory();
