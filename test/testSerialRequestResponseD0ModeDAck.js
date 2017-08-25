/*jshint expr: true*/
var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');
mock('serialport', 'virtual-serialport');

describe('test SerialRequestResponseTransport with D0Protocol with Mode D', function() {

    it('check output of two D0 messages', function(done){
        this.timeout(600000); // because of first install from npm


        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'D0Protocol',
            'transport': 'SerialRequestResponseTransport',
            'transportSerialPort': '/dev/ir-usb1',
            'transportSerialBaudrate': 300,
            'protocolD0WakeupCharacters': 40,
            'requestInterval': 10,
            'transportHttpRequestUrl': '',
            'obisNameLanguage': 'en',
            'obisFallbackMedium': 1,
            'debug': 0
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
            expect(obisResult['1-0:97.97']).to.be.an('object');
            expect(obisResult['1-0:97.97'].rawValue).to.be.equal('00');
            expect(obisResult['1-0:97.97'].values.length).to.be.equal(1);
            expect(obisResult['1-0:97.97'].values[0].value).to.be.equal('00');
            expect(obisResult['1-0:1.8.0']).to.be.an('object');
            expect(obisResult['1-0:1.8.0'].rawValue).to.be.equal('000285.4*kWh');
            expect(obisResult['1-0:1.8.0'].values.length).to.be.equal(1);
            expect(obisResult['1-0:1.8.0'].values[0].value).to.be.equal(285.4);

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
        smTransport.serialComm.on('dataToDevice', function(data) {
            //console.log('RECEIVED ' + data.length + ': ' + JSON.stringify(data));
            if (data === '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0') {
                //console.log('WAKE UP DONE');
            }
            else if (data === '/?!\r\n') {
                //console.log('SEND Identification Message');
                var testData = new Buffer('/ELS5\\@V9.30 \r\n');
                smTransport.serialComm.writeToComputer(testData);
            }
            else if (data === '\u0006050\r\n') {
                testData = new Buffer('\u0006\r\n');
                smTransport.serialComm.writeToComputer(testData);

                testData = new Buffer('\u0002F.F(00)\r\nC.1(1234567890123456)\r\nC.5.0(00)\r\n1.8.0(000285.4*kWh)\r\n2.8.0(000120.1*kWh)\r\n!\r\n');
                smTransport.serialComm.writeToComputer(testData);

                if (!endTimer) {
                    endTimer = setTimeout(function() {
                        smTransport.stop();
                        expect(counter).to.be.equal(2);
                        expect(errCounter).to.be.equal(0);
                        expect(smTransport.protocol.deviceManufacturer).to.be.equal('ELS');
                        expect(smTransport.protocol.commMode).to.be.equal('E');
                        expect(smTransport.serialConnected).to.be.false;
                        setTimeout(done, 1000);
                    }, 13000);
                }
            }
        });

        smTransport.process();

    });
});
