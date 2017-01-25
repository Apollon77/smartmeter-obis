/* jshint -W097 */// jshint strict:false
/*jslint node: true */
var expect = require('chai').expect;
var ObisMeasurement = require('../lib/ObisMeasurement');
var ObisNames = require('../lib/ObisNames');

describe('Test ObisNames', function() {

    it('Test Name resolving', function () {

        console.log(JSON.stringify(ObisNames.resolveObisName(new ObisMeasurement("1-0:1.8.1"), 'de')));
        console.log(JSON.stringify(ObisNames.resolveObisName(new ObisMeasurement("1-0:1.8.1"), 'en')));
        /*expect(new ObisMeasurement("1.8.1").idToString()).to.be.equal("1.8.1");

        expect(new ObisMeasurement("1.8.1*255").idToString()).to.be.equal("1.8.1*255");

        expect(new ObisMeasurement("6.8*01").idToString()).to.be.equal("6.8*1");

        expect(new ObisMeasurement("1-0:1.8.1*255").idToString()).to.be.equal("1-0:1.8.1*255");

        var obis1 = new ObisMeasurement("1-0:1.8.1*255");
        obis1.tariffRate = undefined;
        expect(obis1.idToString()).to.be.equal("1-0:1.8*255");

        expect(new ObisMeasurement("F").idToString()).to.be.equal("97");

        expect(new ObisMeasurement(new Buffer("8181C78227FF", "hex")).idToString()).to.be.equal("129-129:199.130.39*255");

        expect(function() {new ObisMeasurement(new Buffer("8181C78227", "hex"));}).to.throw(Error,/Invalid Buffer length/);

        expect(new ObisMeasurement(1,0,1,8,1,255).idToString()).to.be.equal("1-0:1.8.1*255");

        expect(new ObisMeasurement("1","0","1","8","1","255").idToString()).to.be.equal("1-0:1.8.1*255");

        expect(new ObisMeasurement("8181C78227FF").idToString()).to.be.equal("129-129:199.130.39*255");

        expect(function() {new ObisMeasurement("INVALID");}).to.throw(Error,/Invalid Obis String INVALID/);*/
    });
});
