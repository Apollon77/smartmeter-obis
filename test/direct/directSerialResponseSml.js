var SmartmeterObis = require('../index.js');

var options = {
    'protocol': 'SmlProtocol',
    'transport': 'SerialResponseTransport',
    'transportSerialPort': '/dev/ir-usb0',
    'transportSerialBaudrate': 9600,
    'requestInterval': 10,
    'obisNameLanguage': 'en'
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
