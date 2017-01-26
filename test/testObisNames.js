/* jshint -W097 */// jshint strict:false
/*jslint node: true */
var expect = require('chai').expect;
var ObisMeasurement = require('../lib/ObisMeasurement');
var ObisNames = require('../lib/ObisNames');

describe('Test ObisNames', function() {

    it('Test Name resolving', function () {

        expect(ObisNames.resolveObisName(new ObisMeasurement("1-0:1.8.0"), 'en').obisName).to.be.equal('Time integral 1 Sum active power + (Total)');
        expect(ObisNames.resolveObisName(new ObisMeasurement("1-0:1.8.0"), 'de').obisName).to.be.equal('Zählerstand 1 Summe Wirkarbeit Bezug + (Total)');

        expect(ObisNames.resolveObisName(new ObisMeasurement("1-0:1.8.0"), 'en').mediumName).to.be.equal('Electricity');

        expect(ObisNames.resolveObisName(new ObisMeasurement("1-0:1.8.1"), 'en').obisName).to.be.equal('Time integral 1 Sum active power + (T1)');


        expect(ObisNames.resolveObisName(new ObisMeasurement("6-0:1.8.1"), 'en').obisName).to.be.equal('Heat (T1)');
        expect(ObisNames.resolveObisName(new ObisMeasurement("6.28", 6), 'en').obisName).to.be.equal('Temperature return Nb');
        expect(ObisNames.resolveObisName(new ObisMeasurement("6.28*01", 6), 'en').obisName).to.be.equal('Temperature return Nb previous Year');
    });
});
