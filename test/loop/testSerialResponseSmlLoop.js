var SmartmeterObis = require('../../index.js');

var options = {
    'protocol': 'SmlProtocol',
    'transport': 'SerialResponseTransport',
    'transportSerialPort': '/Volumes/Dev/serial-slave',
    'transportSerialBaudrate': 9600,
    'requestInterval': 10,
    'transportHttpRequestUrl': '',
    'obisNameLanguage': 'en',
    'debug': 2
};

var lastObisResult;
var counter = 0;

function testStoreData(obisResult) {
    console.log('Received data ' + counter + ': ' + Object.keys(obisResult));
    counter++;
    for (var obisId in obisResult) {
        console.log(obisResult[obisId].idToString() + ': ' + SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
    }
}

var smTransport = SmartmeterObis.init(options, testStoreData);

smTransport.process();
