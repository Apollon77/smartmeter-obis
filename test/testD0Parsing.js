/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/
var expect = require('chai').expect;
var D0Protocol = require('../lib/protocols/D0Protocol');

describe('Test D0 Parsing', function() {

    it('Test Parsing', function () {
        var lastErr = null;
        var lastData = null;
        d0 = new D0Protocol({logger: console.log}, function(err, data) {
            lastErr = err;
            lastData = data;
        });

        var res = d0.prepareResult("F\u0019\u000e\u0019vff\u0019vu5j\r\n1-1:52.7.0(230.5*V)\r\n1-1:72.7.0(231.0*V)\r\n1-1:31.7.0(1.704*A)\r\n1-1:51.7.0(1.973*A)\r\n1-1:71.7.0(0.200*A)\r\n1-1:1.7.0(0.000*kW)\r\n1-1:2.7.0(0.076*kW)\r\n");
        console.log(JSON.stringify(res, null, 2));

        expect(Object.keys(res).length).to.be.equal(7);
        expect(res["1-1:52.7.0"]).to.be.an('object');
        expect(lastErr.message.indexOf('Error while parsing D0 content: ignore content before linebreak Error: Invalid Obis String')).to.not.equal(-1);
        expect(lastData).to.be.null;
    });
});
