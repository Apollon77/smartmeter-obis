var chai = require('chai');
var expect = chai.expect;
var nock = require('nock');
var mock = require('mock-require');
mock('serialport', 'virtual-serialport');

describe('test HttpRequestTransport with JsonEfrProtocol', function() {

    it('check output of two JSON messges', function(done){
        this.timeout(600000); // because of first install from npm

        var SmartmeterObis = require('../index.js');

        var options = {
            'protocol': 'JsonEfrProtocol',
            'transport': 'HttpRequestTransport',
            'transportSerialPort': '',
            'transportSerialBaudrate': 0,
            'requestInterval': 10,
            'transportHttpRequestUrl': 'http://test.efr-server.com/json',
            'obisNameLanguage': 'en'
        };

        var lastObisResult;
        var counter = 0;

        function testStoreData(obisResult) {
            // nothing to do in this case because protocol is stateless
            expect(obisResult).to.be.an('object');
            if (counter === 0) {
                expect(obisResult['129-129:199.130.39*255']).to.be.an('object');
                expect(obisResult['129-129:199.130.39*255'].rawValue).to.be.empty;
                expect(obisResult['129-129:199.130.39*255'].values.length).to.be.equal(1);
                expect(obisResult['129-129:199.130.39*255'].values[0].value).to.be.equal('0815');
                expect(obisResult['1-1:1.8.1*255']).to.be.an('object');
                expect(obisResult['1-1:1.8.1*255'].rawValue).to.be.empty;
                expect(obisResult['1-1:1.8.1*255'].values.length).to.be.equal(1);
                expect(obisResult['1-1:1.8.1*255'].values[0].value).to.be.equal(255.16);
                expect(obisResult['1-1:1.8.1*255'].values[0].unit).to.be.equal('kWh');
            }
            else if (counter === 1) {
                expect(obisResult['1-0:2.8.0*128']).to.be.an('object');
                expect(obisResult['1-0:2.8.0*128'].rawValue).to.be.empty;
                expect(obisResult['1-0:2.8.0*128'].values.length).to.be.equal(1);
                expect(obisResult['1-0:2.8.0*128'].values[0].value).to.be.equal(2.66);
                expect(obisResult['1-0:2.8.0*128'].values[0].unit).to.be.equal('kWh');
            }

            if (!lastObisResult) {
                expect(counter).to.be.equal(0);
            }
            else {
                expect(counter).to.be.equal(1);
            }

            console.log('Received data ' + counter + ': ' + Object.keys(obisResult));
            lastObisResult = obisResult;
            counter++;
            for (var obisId in obisResult) {
                console.log(obisResult[obisId].idToString() + ': ' + SmartmeterObis.ObisNames.resolveObisName(obisResult[obisId], options.obisNameLanguage).obisName + ' = ' + obisResult[obisId].valueToString());
            }
        }

        var smTransport = SmartmeterObis.init(options, testStoreData);

        var efrServer = nock('http://test.efr-server.com')
                        .get('/json')
                        .reply(200, '{ "billingData:" : { "assignment" :[ { "obis":"8181C78227FF","value":"0815"}, { "obis":"8181C78205FF","value":"Max"}, { "obis":"8181C78206FF","value":"Mustermann"}, { "obis":"8181C78207FF","value":"Nymphenburger Str. 20b, 80335 Muenchen"}, { "obis":"0100000000FF","value":"1118004892"}, { "obis":"010000090B00","value":"26.11.2012,11:27:23"}], "values" : [ {"obis":"0101010800FF","value":366.83,"unit":"kWh" },{"obis":"0101010801FF","value":255.16,"unit":"kWh"},{"obis":"0101010802FF","value":60.05,"unit":"kWh"},{"obis":"0101010803FF","value":51.53,"unit":"kWh"},{"obis":"0102020800FF","value":6.83,"unit":"kWh"},{"obis":"0102020807FF","value":6.79,"unit":"kWh"},{"obis":"0100010700FF","value":54.04,"unit":"W"},{"obis":"0100150700FF","value":-1.57,"unit":"W"},{"obis":"0100290700FF","value":0.00,"unit":"W"},{"obis":"01003D0700FF","value":55.61,"unit":"W"},{"obis":"010020070000","value":230.04,"unit":"V"},{"obis":"010034070000","value":226.95,"unit":"V"},{"obis":"010048070000","value":228.93,"unit":"V"},{"obis":"01000E070000","value":50.000,"unit":"Hz"},{"obis":"010001080080","value":0.30,"unit":"kWh"},{"obis":"010001080081","value":0.49,"unit":"kWh"},{"obis":"010001080082","value":4.75,"unit":"kWh"},{"obis":"010001080083","value":27.86,"unit":"kWh"},{"obis":"010001080084","value":0.00,"unit":"kWh"},{"obis":"010002080080","value":0.00,"unit":"kWh"},{"obis":"010002080081","value":0.00,"unit":"kWh"},{"obis":"010002080082","value":0.00,"unit":"kWh"},{"obis":"010002080083","value":0.00,"unit":"kWh"},{"obis":"010002080084","value":0.00,"unit":"kWh"} ] }}');
        var efrServer2 = nock('http://test.efr-server.com')
                         .get('/json')
                         .reply(200, '{"billingData:": {"assignment":[ { "obis":"8181C78227FF","value":""}, { "obis":"8181C78205FF","value":""}, { "obis":"8181C78206FF","value":""}, { "obis":"8181C78207FF","value":""}, { "obis":"0100000000FF","value":"1271160146079"}, { "obis":"010000090B00","value":"07.01.2017,13:11:43"}], "values" : [ {"obis":"0101020800FF","value":7860.29,"unit":"kWh"},{"obis":"0100010700FF","value":786.95,"unit":"W"},{"obis":"0100150700FF","value":786.95,"unit":"W"},{"obis":"0100290700FF","value":0.00,"unit":"W"},{"obis":"01003D0700FF","value":0.00,"unit":"W"},{"obis":"010020070000","value":224.13,"unit":"V"},{"obis":"010034070000","value":225.76,"unit":"V"},{"obis":"010048070000","value":223.80,"unit":"V"},{"obis":"01000E070000","value":50.000,"unit":"Hz"},{"obis":"010002080080","value":2.66,"unit":"kWh"},{"obis":"010002080081","value":10.15,"unit":"kWh"},{"obis":"010002080082","value":38.90,"unit":"kWh"},{"obis":"010002080083","value":97.73,"unit":"kWh"},{"obis":"010002080084","value":2036.09,"unit":"kWh"} ] }}');

        smTransport.process();

        setTimeout(function() {
            expect(counter).to.be.equal(2);
            done();
        }, 12000);
    });
});
