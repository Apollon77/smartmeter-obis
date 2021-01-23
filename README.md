# smartmeter-obis

[![Greenkeeper badge](https://badges.greenkeeper.io/Apollon77/smartmeter-obis.svg)](https://greenkeeper.io/)
[![NPM version](http://img.shields.io/npm/v/smartmeter-obis.svg)](https://www.npmjs.com/package/smartmeter-obis)
[![Downloads](https://img.shields.io/npm/dm/smartmeter-obis.svg)](https://www.npmjs.com/package/smartmeter-obis)
[![Code Climate](https://codeclimate.com/github/Apollon77/smartmeter-obis/badges/gpa.svg)](https://codeclimate.com/github/Apollon77/smartmeter-obis)

**Tests:**
[![Test Coverage](https://codeclimate.com/github/Apollon77/smartmeter-obis/badges/coverage.svg)](https://codeclimate.com/github/Apollon77/smartmeter-obis/coverage)
Linux/Mac:
[![Travis-CI](http://img.shields.io/travis/Apollon77/smartmeter-obis/master.svg)](https://travis-ci.org/Apollon77/smartmeter-obis)
Windows: [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/Apollon77/smartmeter-obis?branch=master&svg=true)](https://ci.appveyor.com/project/Apollon77/smartmeter-obis/)

[![NPM](https://nodei.co/npm/smartmeter-obis.png?downloads=true)](https://nodei.co/npm/smartmeter-obis/)

***This library supports nodejs 4.x, 6.x and 8.x because of limitations of the node-serialport library, nodejs 4.x on Win32 is also NOT supported.***

This library supports the reading and parsing of smartmeter protocols that follow the OBIS number logic to make their data available.

Supported Protocols:
* **SmlProtocol**: SML (SmartMeterLanguage) as binary format
* **D0Protocol**: D0 (based on IEC 62056-21:2002/IEC 61107/EN 61107) as ASCII format (binary protocol mode E not supported currently)
* **JsonEfrProtocol**: OBIS data from EFR Smart Grid Hub (JSON format)

Supported Transports (how to receive the data):
* **SerialResponseTransport**: receive through serial push data (smartmeter send data without any request on regular intervals). Mostly used for SML
* **SerialRequestResponseTransport**: D0 protocol in modes A, B, C and D (mode E curently NOT supported!) with Wakeup-, Signon-, pot. ACK- and Data-messages to read out data (programing/write mode not implemented so far)
* **HttpRequestTransport**: Read data via HTTP by requesting an defined URL
* **LocalFileTransport**: Read data from a local file
* **StdInTransport**: Read data from stdin
* **TCPTransport**: Read data from a tcp socket

## Usage example (example for SerialRequestResponseTransport with D0Protocol)

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

function displayData(err, obisResult) {
    if (err) {
        // handle error
        // if you want to cancel the processing because of this error call smTransport.stop() before returning
        // else processing continues
        return;
    }
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

setTimeout(smTransport.stop, 60000);

```

## Usage informations
The easiest way to use the library is to use the options Object with all data to set the Library configure and initialize by it's own.

Therefor you use the **init(options, storeCallback)** method and provide an options Object and a callback function. The callback function is called with an error object and the parsed result as soon as a message is received completely and successfully. The callback function will get an Array of "ObisMeasurement" objects on suvccess while each entry contains all data for one datapoint. In error case you get an error object in the first parameter and can control if a new cycle should be started (return true) or if you want to stop processing (return false).
The **init(options, storeCallback)** returns the initialized Transport instance to use to control the dataflow.

Everything else to do is to call the **process()** method from the returned Transport instance and the whole magic happends in the background. The called method can throw an Error as soon as invalid messages are received.
In normal operation the process requests or receives the data in the defined intervals. Call **stop()** method from Transport instance to do a clean stop.

To debug you can also use the special debug option in the options-array.

The process

## Description of options
| Param | Type | Description |
| --- | --- | --- |
| **Basic configuration** |
| [protocol] | <code>string</code> | required, value **SmlProtocol**, **D0Protocol** or **JsonEfrProtocol** |
| [transport] | <code>string</code> | required, value **SerialResponseTransport**, **SerialRequestResponseTransport**, **HttpRequestTransport**, **LocalFileTransport**, **StdInTransport** or **TCPTransport** |
| [requestInterval] | <code>number</code> | optional, number of seconds to wait for next request or pause serial receiving, value 0 possible to restart directly after finishing one message, Default: is 300 (=5 Minutes) |
| **Transport specific options** |
| [transportSerialPort] | <code>string</code> | required for Serial protocols, Serial device name, e.g. "/dev/ttyUSB0" |
| [transportSerialBaudrate] | <code>number</code> | optional, baudrate for initial serial connection, if not defined default values per Transport type are used (9600 for SerialResponseTransprt and 300 for SerialRequestResponseTransport) |
| [transportSerialDataBits] | <code>number</code> | optional, Must be one of: 8, 7, 6, or 5. |
| [transportSerialStopBits] | <code>number</code> | optional, Must be one of: 1 or 2. |
| [transportSerialParity] | <code>string</code> | optional, Must be one of: 'none', 'even', 'mark', 'odd', 'space' |
| [transportSerialMaxBufferSize] | <code>number</code> | optional, default value is 300000 (means after 300000 bytes without a matching message an Error is thrown ) |
| [transportSerialMessageTimeout] | <code>number</code> | ms, optional, default value is 120000 (means after 120000ms without a matching message or new data an Error is thrown ) |
| [transportHttpRequestUrl] | <code>string</code> | required for **HttpRequestTransport**, Request URL to query data from |
| [transportHttpRequestTimeout] | <code>number</code> | optional for **HttpRequestTransport**, Timeout in ms, defaut 2000 |
| [transportLocalFilePath] | <code>string</code> | required for **LocalFileTransport**, File patch to read data from |
| [transportStdInMaxBufferSize] | <code>number</code> | optional, default value is 300000 (means after 300000 bytes without a matching message an Error is thrown ) |
| [transportStdInMessageTimeout] | <code>number</code> | ms, optional, default value is 120000 (means after 120000ms without a matching message or new data an Error is thrown ) |
| [transportTcpMaxBufferSize] | <code>number</code> | optional, default value is 300000 (means after 300000 bytes without a matching message an Error is thrown ) |
| [transportTcpMessageTimeout] | <code>number</code> | ms, optional, default value is 120000 (means after 120000ms without a matching message or new data an Error is thrown ) |
| **Protocol specific options** |
| [protocolD0WakeupCharacters] | <code>number</code> | optional for **D0Protocol**, number of wakeup NULL characters, default 0 |
| [protocolD0DeviceAddress] | <code>string</code> | optional for **D0Protocol**, device address (max 32 characters) for SignIn-Message, default empty |
| [protocolD0SignOnMessage] | <code>string</code> | optional for **D0Protocol**, command for SignIn-Message, default "?" to query mandatory fields, other values depending on device. You can provide multiple SignOn messages separated by a comma. The delay between them can be set by parameter anotherQueryDelay |
| [protocolD0ModeOverwrite] | <code>string</code> | optional for **D0Protocol**, to ignore the mode send by the device set the correct D0 mode here. The mode send by the device in the identification message is ignored |
| [protocolD0BaudrateChangeoverOverwrite] | <code>number</code> | optional for **D0Protocol**, when the D0 mode needs a baudrate changeover, but the device information from identification message is wrong, overwrite with this value |
| [protocolSmlIgnoreInvalidCRC] | <code>boolean</code> | required for **SmlProtocol**, if false and CRC checksum is invalid an Error is thrown |
| [protocolSmlInputEncoding] | <code>string</code> | optionalfor **SmlProtocol**, if set defines the input Encoding of the data. Default is "binary" (as received from a serial connection). Other options are "ascii", "utf-8" or "base64" |
| [anotherQueryDelay] | <code>number</code> | optional for **D0Protocol** with **SerialRequestResponseTransport** when multiple SignOnMessages are given. Value is in ms, default 1000 |
| **OBIS options** |
| [obisFallbackMedium] | <code>number</code> | optional, if smartmeter do not return complete OBIS IDs (without medium info) this will be used as fallback for name resolving |
| **Debugging options** |
| [debug] | <code>number</code> | optional, values: 0 (no logging), 1 (basic logging), 2 (detailed logging), Default: 0 |
| [logger] | <code>function</code> | optional, logging function that accepts one parameter to log a string. Default is "console.log" |



## Library is tested with ...
... at least:
* Hager eHz Energy Meter (multiple, e.g. eHZ-IW8E2A5L0EK2P, EHZ363W5, )
* EMH Energy Meter
* EFR SmartGridHub
* Siemens 2WR5 reader from an heat station
* Elster AS1440
* Iskraemeco MT174
* Itron EM214 Typ 720
* Dutch smart-meters (use Serial-Read-only with correct baudrate according to your smart meter if needed and "D0" as protocol)
* DZG DWS7412.1T
  * *IMPORTANT*: There seems to be a Firmware bug and sometimes the current energy consumptions becomes negative! Manual recalculation possible using formular from https://github.com/Apollon77/smartmeter-obis/issues/75#issuecomment-581650736
* Landis & Gyr E220, Landis+Gyr E350 EDL21
  * potentially you need to configure to send some wake up characters
* ... and many more

Please send me an info on devices where you have used the library successfully and I will add it here.


## Todos
* finalize tests in ObisNames (german/english) and remove mixtures
* Support for OMS somehow?
* Add testing for TCPTransport

## Changelog

### 2.3.0 (2021-01-23)
* add protocolSmlInputEncoding to allow other input encodings for SML messages

### 2.2.0 (2020-12-17)
* add Typescript typings (credits to pkwagner)

### 2.1.6 (2020-11-15)
* update OpenSML lib to support Holley DTZ541 wrongly implemented CRC Algorithm

### 2.1.5 (2020-09-21)
* really read over all network data for tcp socket usage when paused

### 2.1.4 (2020-09-21)
* prevent potential crash in TCP Transport (Sentry IOBROKER-SMARTMETER-R)
* Read over all network data for tcp socket usage when paused

### 2.1.3 (2020-07-20)
* fix Sentry crash IOBROKER-SMARTMETER-P
* update OpenSML library to prevent some crash cases

### v2.1.2 (2020-04-12)
* catch errors when no memory is available anymore and stop processing

### v2.1.1 (2020-03-11)
* handle stopping of process better
* TCP Transport optimization

### v2.1.0 (2020-03-08)
* Add TCPTransport support (thanks to @chris1705)
* fix a potential crash
* correctly ignore invalid CRC

### v2.0.5 (2020-02-04)
* handle stopping of process better
* make sure HTTP based smartmeters are also polled frequently when responses are invalid

### v2.0.4 (2019-12-20)
* handle stopping of process better

### v2.0.3 (2019-12-18)
* handle stopping of process better

### v2.0.2 (2019-12-07)
* handle serial port closes better

### v2.0.1 (2019-12-05)
* fix some smaller edge cases

### v2.0.0 (2019-11-26)
* update deps, support nodejs 8.x till 12.x
* update Buffer usage
* Add GitHub Actions for Test and Release

### v1.1.3 (11.11.2018)
* Small fix

### v1.1.2 (26.03.2018)
* Add better support for devices with more then 16 values (OpenSML Library upgrade)

### v1.1.0 (31.01.2018)
* output some logging messages only in debug=2 mode
* add StdInTransport options to also allow to process node "Stdin" streams
* add option to send multiple SignOn messages with D0Protocol and SerialRequestResponseTransport
* also accept "&" in OBIS IDs instead of "*" that is sent by EMH ITZ sometimes
* add some better Error handling for D0 messages and ignore pot. "trash" content before dataflow
* switch to Serialport 6.0.4 to make everything more stable and fix needed things in code for This
* a requestInterval of -1 will end processing after one message in all Transports
* SerialResponseTransport and StdInTransport will process all data which is available before readming new. Buffer needs to be big enough else Buffer-Overruns will be catched

### v1.0.0 (2x.08.2017)
* change callback to new error-first style and replace most thrown errors by a call to the callback method with error object and fix some timing issues

### v0.6.0 (01.08.2017)
* A serial timeout will no longer trigger an Exception. Instead connection is reset and next cycle is scheduled as configured

### v0.5.12 (23.07.2017)
* Use newest version of SML Library

### v0.5.11 (21.06.2017)
* Optimize D0 protocol handling and support dutch DSRM protocol

### v0.5.7 (08.05.2017)
* Handle special problem cases with soem devices better

### v0.5.6 (04.04.2017)
* Windows do not support pause and resume on SerialPort

### v0.5.5 (19.03.2017)
* Further optimizations for D0 protocol and baudrate changover logic
* enhanced D0 protocol support for multiple values

### v0.5.2 (14.03.2017)
* integrate MessageTimeout also for SerialResponseTransport to avoid unparsed message cases

### v0.5.1 (26.02.2017)
* maintenance update

### v0.4.1 (24.02.2017)
* fix potential hanging communication for special SerialRequestResponseTransfer cases

### v0.4.0 (23.02.2017)
* optimizations for SerialRequestResponseTransport for D0 Protocol

### v0.3.5 (22.02.2017)
* optimizations on D0 message handling for mode E

### v0.3.4 (11.02.2017)
* optimizations on D0 message handling

### v0.3.3 (10.02.2017)
* optimizations
* use own open-sml repository as basis for installation (not ideal but used till acceptance of pull-request)

### v0.3.2 (07.02.2017)
* add testing for real simulated serialport as manual testscript
* fix debug logging

### v0.3.1 (06.02.2017)
* optimize memory handling

### v0.3.0 (05.02.2017)
* support also some letters as measurement-Type (some devices send "F.F")
* allow overwriting of D0 Modus and D0 Baudrate Changeover (because some devices send a wrong identification)
* do not throw error when mode E is detected, but log ... maybe some data are useable

### v0.2.6/v0.2.7 (04.02.2017)
* Optimizations on serial handling for some weired SIGABRT cases

### v0.2.5
* add optional option "transportSerialMessageTimeout" with default of 60s to make sure the process do not hand forever when missing response from device on bi-directional communication

### v0.2.4
* finally fix exception on "stop" method

### v0.2.3
* fix exception on "stop" method
* README fixes

### v0.2.2
* README fix on options list
* remove unneeded/unused option

### v0.2.1
* aded changelog to README :-)
* small fix in Serial*Transport classes
* changed codeclimate config to ignore code duplication warnings

### v0.0.1-0.2.0
* initial development, testing and real-live usage with optimizations
* incorporated first feedback from external users
* initial fully working version is 0.2.0
