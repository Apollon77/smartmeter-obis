var SmartmeterObis = require('../../index.js');

var options = {
    'protocol': 'SmlProtocol',
    'transport': 'StdInTransport',
    'requestInterval': 0,
    'obisNameLanguage': 'de',
    'transportStdInMaxBufferSize': 1000000,
    'debug': 2
};

var lastObisResult;
var counter = 0;
var errCounter = 0;

function displayData(err, obisResult) {
    if (err) {
        console.log('ERROR: ' + err);
        return;
    }
    for (var obisId in obisResult) {
        console.log(obisResult[obisId].idToString() + ': ' + SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
    }
}

var smTransport = SmartmeterObis.init(options, displayData);

smTransport.process();
