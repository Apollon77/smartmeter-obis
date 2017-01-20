var SerialPort = require('serialport');
var SmlProtocol = require('../../lib/protocols/SmlProtocol');
var SerialResponseTransport = require('../../lib/transports/SerialResponseTransport');

var options = {
    'protocol': "SML",
    'transport': "serialDevice",
    'transportSerialPort': "/dev/ir-usb0",
    'transportSerialBaudrate': 9600,
    'requestInterval': 10,
    'transportHttpRequestUrl': ''
};

function displayData(obisResult) {
    console.log("Received data: " + Object.keys(obisResult));
    console.log(JSON.stringify(obisResult,null,2));
}

var smProtocol = new SmlProtocol(options, displayData);
var smTransport = new SerialResponseTransport(options, smProtocol);

smTransport.init();

smTransport.process();

setTimeout(process.exit, 60000);
