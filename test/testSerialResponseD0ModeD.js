var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');

describe('test SerialResponseTransport with D0 Mode D', function() {

    it('check output of two D0-Mode D messges', function(done){
        this.timeout(600000); // because of first install from npm

        mock('serialport', 'virtual-serialport');

        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'D0Protocol',
            'transport': 'SerialRequestResponseTransport',
            'transportSerialPort': '/dev/ir-usb1',
            'transportSerialBaudrate': 2400,
            'protocolD0WakeupCharacters': 40,
            'protocolD0DeviceAddress': 'Bla0',
            'requestInterval': 10,
            'transportHttpRequestUrl': ''
        };

        var lastObisResult = null;
        var counter = 0;

        function testStoreData(obisResult) {
            // nothing to do in this case because protocol is stateless
            expect(obisResult).to.be.an('object');
            expect(obisResult['9.20']).to.be.an('object');
            expect(obisResult['9.20'].rawValue).to.be.equal('64030874');
            expect(obisResult['9.20'].values.length).to.be.equal(1);
            expect(obisResult['9.20'].values[0].value).to.be.equal(64030874);
            expect(obisResult['6.8']).to.be.an('object');
            expect(obisResult['6.8'].rawValue).to.be.equal('0029.055*MWh');
            expect(obisResult['6.8'].values.length).to.be.equal(1);
            expect(obisResult['6.8'].values[0].value).to.be.equal(29.055);
            expect(obisResult['6.8'].values[0].unit).to.be.equal('MWh');

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

        //console.log('SEND Identification Message');
        var testData = new Buffer('/SIE32WR5\r\n');
        smTransport.serialComm.writeToComputer(testData);

        setTimeout(function() {
            //console.log('SEND Data Message');
            var testData = new Buffer('6.8(0029.055*MWh)6.26(01589.28*m3)9.21(00010213)6.26*01(01563.92*m3)6.8*01(0028.086*MWh)F(0)9.20(64030874)6.35(60*m)6.6(0017.2*kW)6.6*01(0017.2*kW)6.33(001.476*m3ph)9.4(088*C&082*C)6.31(0030710*h)6.32(0000194*h)9.22(R)9.6(000&00010213&0)9.7(20000)6.32*01(0000194*h)6.36(01-01)6.33*01(001.476*m3ph)6.8.1()6.8.2()6.8.3()6.8.4()6.8.5()6.8.1*01()6.8.2*01()6.8.3*01()\r\n6.8.4*01()6.8.5*01()9.4*01(088*C&082*C)6.36.1(2013-11-28)6.36.1*01(2013-11-28)6.36.2(2016-09-24)6.36.2*01(2016-09-24)6.36.3(2015-03-26)6.36.3*01(2015-03-26)6.36.4(2013-09-27)6.36.4*01(2013-09-27)6.36.5(2000-00-00)6.36*02(01)9.36(2017-01-18&01:36:47)9.24(0.6*m3ph)9.17(0)9.18()9.19()9.25()9.1(0&1&0&-&CV&3&2.14)9.2(&&)0.0(00010213)!\r\n');
            smTransport.serialComm.writeToComputer(testData);

            setTimeout(function() {
                //console.log('SEND Identification Message');
                var testData = new Buffer('/SIE32WR5\r\n');
                smTransport.serialComm.writeToComputer(testData);

                setTimeout(function() {
                    //console.log('SEND Data Message');
                    var testData = new Buffer('6.8(0029.055*MWh)6.26(01589.28*m3)9.21(00010213)6.26*01(01563.92*m3)6.8*01(0028.086*MWh)F(0)9.20(64030874)6.35(60*m)6.6(0017.2*kW)6.6*01(0017.2*kW)6.33(001.476*m3ph)9.4(088*C&082*C)6.31(0030710*h)6.32(0000194*h)9.22(R)9.6(000&00010213&0)9.7(20000)6.32*01(0000194*h)6.36(01-01)6.33*01(001.476*m3ph)6.8.1()6.8.2()6.8.3()6.8.4()6.8.5()6.8.1*01()6.8.2*01()6.8.3*01()\r\n6.8.4*01()6.8.5*01()9.4*01(088*C&082*C)6.36.1(2013-11-28)6.36.1*01(2013-11-28)6.36.2(2016-09-24)6.36.2*01(2016-09-24)6.36.3(2015-03-26)6.36.3*01(2015-03-26)6.36.4(2013-09-27)6.36.4*01(2013-09-27)6.36.5(2000-00-00)6.36*02(01)9.36(2017-01-18&01:36:47)9.24(0.6*m3ph)9.17(0)9.18()9.19()9.25()9.1(0&1&0&-&CV&3&2.14)9.2(&&)0.0(00010213)!\r\n');
                    smTransport.serialComm.writeToComputer(testData);

                    setTimeout(function() {
                        expect(counter).to.be.equal(2);
                        expect(smTransport.protocol.deviceManufacturer).to.be.equal('SIE');
                        expect(smTransport.protocol.commBaudrateChangeover).to.be.equal(2400);
                        expect(smTransport.serialConnected).to.be.false;
                        smTransport.serialComm.removeAllListeners();
                        done();
                    }, 2000);
                }, 100);
            }, 11000);
        }, 100);
    });
});
