/*jshint expr: true*/
var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');

describe('test SerialResponseTransport with D0 DSMR', function() {

    it('check output of two D0-Mode DSMR message', function(done){
        this.timeout(600000); // because of first install from npm

        mock('serialport', 'virtual-serialport');

        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'D0Protocol',
            'transport': 'SerialResponseTransport',
            'transportSerialPort': '/dev/ir-usb1',
            'transportSerialBaudrate': 2400,
            'protocolD0WakeupCharacters': 40,
            'protocolD0DeviceAddress': '',
            //'protocolD0ModeOverwrite': 'E',
            'requestInterval': 10,
            'transportHttpRequestUrl': '',
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
                return true;
            }
            // nothing to do in this case because protocol is stateless
            expect(obisResult).to.be.an('object');
            expect(obisResult['1-0:1.8.1']).to.be.an('object');
            expect(obisResult['1-0:1.8.1'].rawValue).to.be.equal('123456.789*kWh');
            expect(obisResult['1-0:1.8.1'].values.length).to.be.equal(1);
            expect(obisResult['1-0:1.8.1'].values[0].value).to.be.equal(123456.789);
            expect(obisResult['1-0:1.8.1'].values[0].unit).to.be.equal('kWh');
/*            expect(obisResult['6.8']).to.be.an('object');
            expect(obisResult['6.8'].rawValue).to.be.equal('0029.055*MWh');
            expect(obisResult['6.8'].values.length).to.be.equal(1);
            expect(obisResult['6.8'].values[0].value).to.be.equal(29.055);
            expect(obisResult['6.8'].values[0].unit).to.be.equal('MWh');*/

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
        }

        var smTransport = SmartmeterObis.init(options, testStoreData);

        smTransport.process();

        setTimeout(function() {
            var testData = new Buffer('/ISk5\2MT382-1000\r\n');
            smTransport.serialComm.writeToComputer(testData);

            setTimeout(function() {
                testData = new Buffer('1-3:0.2.8(40)\r\n0-0:1.0.0(101209113020W)\r\n0-0:96.1.1(4B384547303034303436333935353037)\r\n1-0:1.8.1(123456.789*kWh)\r\n1-0:1.8.2(123456.789*kWh)\r\n1-0:2.8.1(123456.789*kWh)\r\n1-0:2.8.2(123456.789*kWh)\r\n0-0:96.14.0(0002)\r\n1-0:1.7.0(01.193*kW)\r\n1-0:2.7.0(00.000*kW)\r\n0-0:17.0.0(016.1*kW)\r\n0-0:96.3.10(1)\r\n0-0:96.7.21(00004)\r\n0-0:96.7.9(00002)\r\n1-0:99.97.0(2)(0:96.7.19)(101208152415W)(0000000240*s)(101208151004W)(00000000301*s)\r\n1-0:32.32.0(00002)\r\n1-0:52.32.0(00001)\r\n1-0:72.32.0(00000)\r\n1-0:32.36.0(00000)\r\n1-0:52.36.0(00003)\r\n1-0:72.36.0(00000)\r\n0-0:96.13.1(3031203631203831)\r\n0-0:96.13.0(303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F)\r\n0-1:24.1.0(03)\r\n0-1:96.1.0(3232323241424344313233343536373839)\r\n0-1:24.2.1(101209110000W)(12785.123*m3)\r\n0-1:24.4.0(1)\r\n!522B\r\n');
                smTransport.serialComm.writeToComputer(testData);

                setTimeout(function() {
                    var testData = new Buffer('/ISk5\2MT382-1000\r\n');
                    smTransport.serialComm.writeToComputer(testData);

                    setTimeout(function() {
                        testData = new Buffer('1-3:0.2.8(40)\r\n0-0:1.0.0(101209113020W)\r\n0-0:96.1.1(4B384547303034303436333935353037)\r\n1-0:1.8.1(123456.789*kWh)\r\n1-0:1.8.2(123456.789*kWh)\r\n1-0:2.8.1(123456.789*kWh)\r\n1-0:2.8.2(123456.789*kWh)\r\n0-0:96.14.0(0002)\r\n1-0:1.7.0(01.193*kW)\r\n1-0:2.7.0(00.000*kW)\r\n0-0:17.0.0(016.1*kW)\r\n0-0:96.3.10(1)\r\n0-0:96.7.21(00004)\r\n0-0:96.7.9(00002)\r\n1-0:99.97.0(2)(0:96.7.19)(101208152415W)(0000000240*s)(101208151004W)(00000000301*s)\r\n1-0:32.32.0(00002)\r\n1-0:52.32.0(00001)\r\n1-0:72.32.0(00000)\r\n1-0:32.36.0(00000)\r\n1-0:52.36.0(00003)\r\n1-0:72.36.0(00000)\r\n0-0:96.13.1(3031203631203831)\r\n0-0:96.13.0(303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F303132333435363738393A3B3C3D3E3F)\r\n0-1:24.1.0(03)\r\n0-1:96.1.0(3232323241424344313233343536373839)\r\n0-1:24.2.1(101209110000W)(12785.123*m3)\r\n0-1:24.4.0(1)\r\n!522B\r\n');
                        smTransport.serialComm.writeToComputer(testData);

                        setTimeout(function() {
                            smTransport.stop();
                            expect(counter).to.be.equal(2);
                            expect(errCounter).to.be.equal(0);
                            expect(smTransport.protocol.deviceManufacturer).to.be.equal('ISk');
                            expect(smTransport.serialConnected).to.be.false;
                            setTimeout(done, 1000);
                        }, 2000);
                    }, 500);
                }, 11000);
            }, 500);

        }, 1000);
    });
});
