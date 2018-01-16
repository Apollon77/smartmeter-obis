/*jshint expr: true*/
var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');
mock('serialport', 'virtual-serialport');

describe('test SerialRequestResponseTransport with D0Protocol', function() {

    it('check output of two D0 messages', function(done){
        this.timeout(600000); // because of first install from npm


        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'D0Protocol',
            'transport': 'SerialResponseTransport',
            'transportSerialPort': '/dev/ir-usb1',
            'transportSerialBaudrate': 300,
            'protocolD0WakeupCharacters': 0,
            'protocolD0DeviceAddress': '',
            'requestInterval': 10,
            'transportHttpRequestUrl': '',
            'obisNameLanguage': 'en',
            'obisFallbackMedium': 1,
            'protocolD0ModeOverwrite':'B',
            'debug': 2
        };

        var lastObisResult;
        var counter = 0;
        var errCounter = 0;

        function testStoreData(err, obisResult) {
            if (err) {
                expect(obisResult).to.be.null;
                errCounter++;
                console.log('ERROR: ' + err);
                return;
            }
            // nothing to do in this case because protocol is stateless
            expect(obisResult).to.be.an('object');
            /*expect(obisResult['6-0:9.20']).to.be.an('object');
            expect(obisResult['6-0:9.20'].rawValue).to.be.equal('64030874');
            expect(obisResult['6-0:9.20'].values.length).to.be.equal(1);
            expect(obisResult['6-0:9.20'].values[0].value).to.be.equal(64030874);
            expect(obisResult['6-0:6.8']).to.be.an('object');
            expect(obisResult['6-0:6.8'].rawValue).to.be.equal('0029.055*MWh');
            expect(obisResult['6-0:6.8'].values.length).to.be.equal(1);
            expect(obisResult['6-0:6.8'].values[0].value).to.be.equal(29.055);
            expect(obisResult['6-0:6.8'].values[0].unit).to.be.equal('MWh');
            expect(obisResult['6-0:6.8'].values[0].unit).to.be.equal('MWh');
            expect(Object.keys(obisResult).length).to.be.equal(50);*/

            if (!lastObisResult) {
                expect(counter).to.be.equal(0);
            }
            else {
                expect(counter).to.be.equal(1);
                expect(JSON.stringify(lastObisResult)).to.be.equal(JSON.stringify(obisResult));
            }

            console.log('Received data ' + counter + ': ' + Object.keys(obisResult));
            //console.log(JSON.stringify(obisResult,null,2));
            lastObisResult = obisResult;
            counter++;
            for (var obisId in obisResult) {
                console.log(obisResult[obisId].idToString() + ': ' + SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
            }
        }

        var smTransport = SmartmeterObis.init(options, testStoreData);

        var endTimer = null;
        setTimeout(function() {
            //console.log('SEND Data Message');
            var testData = new Buffer('/EMH5----eHZ-E0018E\r\n\r\n1-0:0.0.0*255(331200-5009810)\r\n1-0:1.8.1*255(032942.0231)\r\n1-0:96.5.5*255(80)\r\n0-0:96.1.255*255(0000680476)\r\n!\r\n');
            smTransport.serialComm.writeToComputer(testData);

            setTimeout(function() {
                testData = new Buffer('/EMH5----eHZ-E0018E\r\n\r\n1-0:0.0.0*255(331200-5009810)\r\n1-0:1.8.1*255(032942.0234)\r\n1-0:96.5.5*255(80)\r\n0-0:96.1.255*255(0000680476)\r\n!\r\n');
                smTransport.serialComm.writeToComputer(testData);

                if (!endTimer) {
                    endTimer = setTimeout(function() {
                        expect(smTransport.stopRequests).to.be.false;
                        smTransport.stop();
                        expect(counter).to.be.equal(1);
                        expect(errCounter).to.be.equal(0);
                        expect(smTransport.protocol.deviceManufacturer).to.be.equal('EMH');
                        expect(smTransport.serialConnected).to.be.false;
                        setTimeout(done, 1000);
                    }, 1000);
                }
            }, 300);
        }, 100);

        smTransport.process();

    });
});
