var SerialPort = require('serialport');
var SmlProtocol = require('../../lib/protocols/SmlProtocol');
var SerialResponseTransport = require('../../lib/transports/SerialResponseTransport');
var ObisNames = require('../lib/ObisNames');

var options = {
    'protocol': "SmlProtocol",
    'transport': "SerialResponseTransport",
    'transportSerialPort': "/dev/ir-usb0",
    'transportSerialBaudrate': 9600,
    'requestInterval': 10
};

function displayData(obisResult) {
    //console.log("Received data: " + Object.keys(obisResult));
    //console.log(JSON.stringify(obisResult,null,2));
    for (var obisId in obisResult) {
        console.log(obisResult[obisId].idToString() + ": " + ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
    }
}

var smProtocol = new SmlProtocol(options, displayData);
var smTransport = new SerialResponseTransport(options, smProtocol);

smTransport.init();

smTransport.process();

setTimeout(process.exit, 60000);
