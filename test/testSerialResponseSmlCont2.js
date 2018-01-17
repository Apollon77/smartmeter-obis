/*jshint expr: true*/
var chai = require('chai');
var expect = chai.expect;
var mock = require('mock-require');

describe('test SerialResponseTransport with SMLProtocol', function() {

    it('check output of two SML messages', function(done){
        this.timeout(600000); // because of first install from npm

        mock('serialport', 'virtual-serialport');

        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'SmlProtocol',
            'transport': 'SerialResponseTransport',
            'transportSerialPort': '/dev/ir-usb0',
            'transportSerialBaudrate': 9600,
            'requestInterval': 0,
            'transportHttpRequestUrl': '',
            'obisNameLanguage': 'en',
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
            expect(obisResult['129-129:199.130.3*255']).to.be.an('object');
            expect(obisResult['129-129:199.130.3*255'].rawValue).to.be.undefined;
            expect(obisResult['129-129:199.130.3*255'].values.length).to.be.equal(1);
            expect(obisResult['129-129:199.130.3*255'].values[0].value).to.be.equal('EMH');
            expect(obisResult['1-0:1.8.1*255']).to.be.an('object');
            expect(obisResult['1-0:1.8.1*255'].rawValue).to.be.undefined;
            expect(obisResult['1-0:1.8.1*255'].values.length).to.be.equal(1);
            expect(obisResult['1-0:1.8.1*255'].values[0].value).to.be.equal(15338.5557);
            expect(obisResult['1-0:1.8.1*255'].values[0].unit).to.be.equal('kWh');

            if (!lastObisResult) {
                expect(counter).to.be.equal(0);
            }
            else {
                expect(counter).to.be.oneOf([1,2,3]);
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

        smTransport.process();

        setTimeout(function() {
            var testData = new Buffer('010203041b1b1b1b01010101760700190b4cbead6200620072630101760101070019063f3f8f0b0901454d48000041f045010163662d00760700190b4cbeae620062007263070177010b0901454d48000041f045070100620affff72620165063f2f357777078181c78203ff0101010104454d480177070100000009ff010101010b0901454d48000041f0450177070100010800ff6400018201621e52ff560009247a550177070100010801ff0101621e52ff560009247a550177070100010802ff0101621e52ff5600000000000177070100100700ff0101621b52ff55000016030177078181c78205ff0172620165063f2f3501018302e77ef33ea97bb6bba9bfa4fbd8b9f2ede51207b15acf6b98a237c21ca4982ee3ce18efe8438f1deba9d5c40eb68ae8f201010163574a00760700190b4cbeb16200620072630201710163d658000000001b1b1b1b1a03e5661b1b1b1b01010101760700190b4cbead6200620072630101760101070019063f3f8f0b0901454d48000041f045010163662d00760700190b4cbeae620062007263070177010b0901454d48000041f045070100620affff72620165063f2f357777078181c78203ff0101010104454d480177070100000009ff010101010b0901454d48000041f0450177070100010800ff6400018201621e52ff560009247a550177070100010801ff0101621e52ff560009247a550177070100010802ff0101621e52ff5600000000000177070100100700ff0101621b52ff55000016030177078181c78205ff0172620165063f2f3501018302e77ef33ea97bb6bba9bfa4fbd8b9f2ede51207b15acf6b98a237c21ca4982ee3ce18efe8438f1deba9d5c40eb68ae8f201010163574a00760700190b4cbeb16200620072630201710163d658000000001b1b1b1b1a03e5', 'hex');
            smTransport.serialComm.writeToComputer(testData);

            setTimeout(function() {
                var testData = new Buffer('671b1b1b1b01010101760700190b4cbead6200620072630101760101070019063f3f8f0b0901454d48000041f045010163662d00760700190b4cbeae620062007263070177010b0901454d48000041f045070100620affff72620165063f2f357777078181c78203ff0101010104454d480177070100000009ff010101010b0901454d48000041f0450177070100010800ff6400018201621e52ff560009247a550177070100010801ff0101621e52ff560009247a550177070100010802ff0101621e52ff5600000000000177070100100700ff0101621b52ff55000016030177078181c78205ff0172620165063f2f3501018302e77ef33ea97bb6bba9bfa4fbd8b9f2ede51207b15acf6b98a237c21ca4982ee3ce18efe8438f1deba9d5c40eb68ae8f201010163574a00760700190b4cbeb16200620072630201710163d658000000001b1b1b1b1a03e5', 'hex');
                smTransport.serialComm.writeToComputer(testData);

                setTimeout(function() {
                    var testData = new Buffer('661b1b1b1b01010101760700190b4cbead6200620072630101760101070019063f3f8f0b0901454d48000041f045010163662d00760700190b4cbeae620062007263070177010b0901454d48000041f045070100620affff72620165063f2f357777078181c78203ff0101010104454d480177070100000009ff010101010b0901454d48000041f0450177070100010800ff6400018201621e52ff560009247a550177070100010801ff0101621e52ff560009247a550177070100010802ff0101621e52ff5600000000000177070100100700ff0101621b52ff55000016030177078181c78205ff0172620165063f2f3501018302e77ef33ea97bb6bba9bfa4fbd8b9f2ede51207b15acf6b98a237c21ca4982ee3ce18efe8438f1deba9d5c40eb68ae8f201010163574a00760700190b4cbeb16200620072630201710163d658000000001b1b1b1b1a03e56601', 'hex');
                    smTransport.serialComm.writeToComputer(testData);

                    setTimeout(function() {
                        var testData = new Buffer('020304', 'hex');
                        smTransport.serialComm.writeToComputer(testData);

                        setTimeout(function() {
                            expect(smTransport.stopRequests).to.be.false;
                            smTransport.stop();
                            expect(smTransport.stopRequests).to.be.true;
                            expect(counter).to.be.equal(4);
                            expect(errCounter).to.be.equal(0);
                            setTimeout(function() {
                                expect(smTransport.serialConnected).to.be.false;
                                setTimeout(done, 1000);
                            }, 1000);
                        }, 1000);
                    }, 100);
                }, 100);
            }, 100);
        }, 1000);
    });
});
