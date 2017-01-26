# smartmeter-obis

[![NPM version](http://img.shields.io/npm/v/smartmeter-obis.svg)](https://www.npmjs.com/package/smartmeter-obis)
[![Downloads](https://img.shields.io/npm/dm/smartmeter-obis.svg)](https://www.npmjs.com/package/smartmeter-obis)
[![Dependency Status](https://gemnasium.com/badges/github.com/Apollon77/smartmeter-obis.svg)](https://gemnasium.com/github.com/Apollon77/smartmeter-obis)
[![Code Climate](https://codeclimate.com/github/Apollon77/smartmeter-obis/badges/gpa.svg)](https://codeclimate.com/github/Apollon77/smartmeter-obis)

**Tests:**
[![Test Coverage](https://codeclimate.com/github/Apollon77/smartmeter-obis/badges/coverage.svg)](https://codeclimate.com/github/Apollon77/smartmeter-obis/coverage)
Linux/Mac:
[![Travis-CI](http://img.shields.io/travis/Apollon77/smartmeter-obis/master.svg)](https://travis-ci.org/Apollon77/smartmeter-obis)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/Apollon77/smartmeter-obis?branch=master&svg=true)](https://ci.appveyor.com/project/Apollon77/smartmeter-obis/)

[![NPM](https://nodei.co/npm/smartmeter-obis.png?downloads=true)](https://nodei.co/npm/smartmeter-obis/)

This library supports the reading and parsing of smartmeter protocols that follow the OBIS number logic to make their data available.

Supported Protocols:
* **SmlProtocol**: SML (SmartMeterLanguage) as binary format
* **D0Protocol**: D0 (based on IEC 62056-21:2002/IEC 61107/EN 61107) as ASCII format (binary protocol mode E not supported currently)
* **JsonEfrProtocol**: OBIS data from EFR Smart Grid Hub (JSON format)

Supported Transports (how to receive the data):
* **SerialResposeTransport**: receive through serial push data (smartmeter send data without any request on regular intervals). Mostly used for SML
* **SerialRequestResposeTransport**: rD0 protocol in modes A, B, C and D (mode E curently NOT supported!) with Wakeup-, Signon-, pot. ACK- and Data-messages to read out data (programing/write mode not implemented so far)
* **HttpRequestTransport**: Read data via HTTP by requesting an defined URL
* **LocalFileTransport**: Read data from a local file

## Usage example (example for SerialRequestResposeTransport with D0Protocol)

```
var SmartmeterObis = require('smartmeter-obis');

var options = {
    'protocol': "D0Protocol",
    'transport': "SerialRequestResponseTransport",
    'transportSerialPort': "/dev/ir-usb1",
    'transportSerialBaudrate': 300,
    'protocolD0WakeupCharacters': 40,
    'protocolD0DeviceAddress': '',
    'requestInterval': 10,
    'obisNameLanguage': 'en',
    'obisFallbackMedium': 6
};

function displayData(obisResult) {
    for (var obisId in obisResult) {
        console.log(
            obisResult[obisId].idToString() + ': ' +
            SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' +
            obisResult[obisId].valueToString()
        );
    }

}

var smTransport = SmartmeterObis.init(options, displayData);

smTransport.process();

setTimeout(process.exit, 60000);

```

## Usage informations
The easiest way to use the library is to use the options Object with all data to set the Library configure and initialize by it's own.

Therefor you use the **init(options, storeCallback)** method and provide an options Object and a callback function. The callback function is called with the parsed result as soon as a message is received completely and successfully. The callback function will get an Array of "ObisMeasurement" objects while each entry contains all data for one datapoint.
The **init(options, storeCallback)** returns the initialized Transport instance to use to control the dataflow.

Everything else to do is to call the **process()** method from the returned Transport instance and the whole magic happends in the background. The called method can throw an Error as soon as invalid messages are received.

To debug you can also use the special debug option in the options-array.


## Description of options
* debug
* ignore invalid SMl CRC

## Library is tested with ...
* Hager eHz Energy Meter
* EFR SmartGridHub
* Siemens 2WR5 reader from an private heat station


## Todos
* Add code, API and other Documentation
* finalize tests in ObisNames (german/english) and remove mixtures
