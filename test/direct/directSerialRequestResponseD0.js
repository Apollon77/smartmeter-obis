var SmartmeterObis = require('../index.js');

var options = {
    'protocol': 'D0Protocol',
    'transport': 'SerialRequestResponseTransport',
    'transportSerialPort': '/dev/ir-usb1',
    'transportSerialBaudrate': 300,
    'protocolD0WakeupCharacters': 40,
    //'protocolD0SignOnMessage': '#', // request optional values too
    'protocolD0DeviceAddress': '',
    'requestInterval': 10,
    'obisNameLanguage': 'en',
    'obisFallbackMedium': 6
};

function displayData(obisResult) {
    //console.log('Received data: ' + Object.keys(obisResult));
    //console.log(JSON.stringify(obisResult,null,2));
    for (var obisId in obisResult) {
        console.log(obisResult[obisId].idToString() + ': ' + SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
    }

}

var smTransport = SmartmeterObis.init(options, displayData);

smTransport.process();

setTimeout(process.exit, 60000);
