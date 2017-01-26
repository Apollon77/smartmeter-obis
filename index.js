var D0Protocol = require('./lib/protocols/D0Protocol');
var JsonEfrProtocol = require('./lib/protocols/JsonEfrProtocol');
var SmlProtocol = require('./lib/protocols/SmlProtocol');
var SmlUnits = require('./lib/protocols/SmlUnits');

var HttpRequestTransport = require('./lib/transports/HttpRequestTransport');
var LocalFileTransport = require('./lib/transports/LocalFileTransport');
var SerialRequestResponseTransport = require('./lib/transports/SerialRequestResponseTransport');
var SerialResponseTransport = require('./lib/transports/SerialResponseTransport');

var ObisMeasurement = require('./lib/ObisMeasurement');
var ObisNames = require('./lib/ObisNames');

function init(options, writeDataCallback) {
    if (!options.logger || typeof options.logger !== 'function') {
        options.logger = console.log;
    }
    if (options.debug === undefined) {
        options.debug = 0;
    }
    if (options.obisNameLanguage === undefined) {
        options.obisNameLanguage = 'en';
    }
    if (options.requestInterval === undefined) {
        options.requestInterval = 300;
    }

    var smProtocol;
    switch(options.protocol) {
        case 'D0Protocol':
            smProtocol = new D0Protocol(options, writeDataCallback);
            break;
        case 'JsonEfrProtocol':
            smProtocol = new JsonEfrProtocol(options, writeDataCallback);
            break;
        case 'SmlProtocol':
            smProtocol = new SmlProtocol(options, writeDataCallback);
            break;
        default:
            throw Error('Unsupported Protocol ' + options.protocol);
    }

    var smTransport;
    switch(options.transport) {
        case 'HttpRequestTransport':
            smTransport = new HttpRequestTransport(options, smProtocol);
            break;
        case 'LocalFileTransport':
            smTransport = new LocalFileTransport(options, smProtocol);
            break;
        case 'SerialRequestResponseTransport':
            smTransport = new SerialRequestResponseTransport(options, smProtocol);
            break;
        case 'SerialResponseTransport':
            smTransport = new SerialResponseTransport(options, smProtocol);
            break;
        default:
            throw Error('Unsupported Transport ' + options.transport);
    }

    smTransport.init();

    return smTransport;
}

module.exports = {
    D0Protocol: D0Protocol,
    JsonEfrProtocol: JsonEfrProtocol,
    SmlProtocol: SmlProtocol,
    SmlUnits: SmlUnits,
    HttpRequestTransport: HttpRequestTransport,
    LocalFileTransport: LocalFileTransport,
    SerialRequestResponseTransport: SerialRequestResponseTransport,
    SerialResponseTransport: SerialResponseTransport,
    ObisMeasurement: ObisMeasurement,
	ObisNames: ObisNames,

    init: init
};
