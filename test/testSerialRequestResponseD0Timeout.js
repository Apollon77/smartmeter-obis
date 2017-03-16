/*jshint expr: true*/
var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');
mock('serialport', 'virtual-serialport');

describe('test SerialRequestResponseTransport Timeout with D0Protocol', function() {

    it('check timeout', function(done) {
        this.timeout(600000); // because of first install from npm

        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'D0Protocol',
            'transport': 'SerialRequestResponseTransport',
            'transportSerialPort': '/dev/ir-usb1',
            'transportSerialBaudrate': 300,
            'protocolD0WakeupCharacters': 40,
            'protocolD0DeviceAddress': 'Bla0',
            'requestInterval': 10,
            'transportHttpRequestUrl': '',
            'obisNameLanguage': 'en',
            'obisFallbackMedium': 6,
            'transportSerialMessageTimeout': 10000,
            'debug': 0
        };

        var counter = 0;
        function testStoreData(obisResult) {
            console.log('Received data ' + counter + ': ' + Object.keys(obisResult));
            counter++;
            for (var obisId in obisResult) {
                console.log(obisResult[obisId].idToString() + ': ' + SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
            }
        }

        var smTransport = SmartmeterObis.init(options, testStoreData);

        var errorHandled = false;
        var originalException = process.listeners('uncaughtException').pop();
        if (originalException) process.removeListener('uncaughtException', originalException);
        process.once("uncaughtException", function (err) {
            console.log('CATCHED');
            if (originalException) process.listeners('uncaughtException').push(originalException);
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.be.equal('No or too long answer from Serial Device after last request.');
            expect(counter).to.be.equal(0);
            setTimeout(done, 1000);
        });

        smTransport.process();

    });
});
