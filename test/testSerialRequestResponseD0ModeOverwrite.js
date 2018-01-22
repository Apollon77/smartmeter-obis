/*jshint expr: true*/
var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');
mock('serialport', 'virtual-serialport');

describe('test SerialRequestResponseTransport with D0Protocol with Mode-Overwrite', function() {

    it('check output of two D0 messages', function(done){
        this.timeout(600000); // because of first install from npm


        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'D0Protocol',
            'transport': 'SerialRequestResponseTransport',
            'transportSerialPort': '/dev/ir-usb1',
            'transportSerialBaudrate': 300,
            'protocolD0WakeupCharacters': 0,
            'protocolD0ModeOverwrite': 'A',
            'protocolD0BaudrateChangeoverOverwrite': 500,
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
            expect(obisResult['1-0:97.97'].rawValue).to.be.equal('00000000');
            expect(obisResult['1-0:97.97'].values.length).to.be.equal(1);
            expect(obisResult['1-0:97.97'].values[0].value).to.be.equal('00000000');
            expect(obisResult['1-0:0.2.0']).to.be.an('object');
            expect(obisResult['1-0:0.2.0'].rawValue).to.be.equal('V01.69#EEA3546C');
            expect(obisResult['1-0:0.2.0'].values.length).to.be.equal(2);
            expect(obisResult['1-0:0.2.0'].values[0].value).to.be.equal('V01.69');
            expect(obisResult['1-0:0.2.0'].values[1].value).to.be.equal('EEA3546C');

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
            if (data === '/?!\r\n') {
                //console.log('SEND Identification Message');
                var testData = new Buffer('/?!\r\n/ITR5EM214\r\n');
                smTransport.serialComm.writeToComputer(testData);

                testData = new Buffer('\u0002F.F(00000000)\r\n0.0.0(1240007670003202)\r\n0.2.0(V01.69#EEA3546C)\r\n0.2.1(00017245)\r\n1.7.0(00.49*kW)\r\n2.7.0(00.00*kW)\r\n1.8.1(022108.7*kWh)\r\n1.8.2(000000.0*kWh)\r\n2.8.1(010452.0*kWh)\r\n2.8.2(000000.0*kWh)\r\n31.7.0(+000.8*A)\r\n51.7.0(+000.7*A)\r\n71.7.0(+001.2*A)\r\nC.1(53965555)\r\nC.5.0(L1-L2-L3)\r\nC.6.3(03.78*V)\r\nC.8.1(024616.21*h)\r\nC.8.2(000000.00*h)\r\nC.13.21(00000001*secs)\r\nC.13.22(00000001)\r\nC.90(00000100)\r\n!\r\n');
                smTransport.serialComm.writeToComputer(testData);

                if (!endTimer) {
                    endTimer = setTimeout(function() {
                        expect(smTransport.stopRequests).to.be.false;
                        smTransport.stop(function() {
                            expect(counter).to.be.equal(2);
                            expect(errCounter).to.be.equal(0);
                            expect(smTransport.protocol.deviceManufacturer).to.be.equal('ITR');
                            expect(smTransport.protocol.commMode).to.be.equal('A');
                            setTimeout(function() {
                                expect(smTransport.serialConnected).to.be.false;
                                done();
                            }, 100);
                        });
                    }, 13000);
                }
            }
        });

        smTransport.process();

    });
});
