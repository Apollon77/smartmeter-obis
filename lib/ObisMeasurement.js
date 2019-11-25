/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var SmlUnit = require('./protocols/SmlUnits');

function ObisMeasurement(medium, channel, measurement, measureType, tariffRate, previousMeasurement) {
    this.medium = medium;
    this.channel = channel;
    this.measurement = measurement;
    this.measureType = measureType;
    this.tariffRate = tariffRate;
    this.previousMeasurement = previousMeasurement;

    this.rawValue = undefined;
    this.values = [];

    var fallbackMedium;
    if (typeof medium === 'string' && typeof measurement === 'undefined') {
        if (typeof channel !== 'undefined') {
            fallbackMedium = channel;
            channel = undefined;
            this.channel = undefined;
        }
        var obisArr = medium.match(/^([0-9]{1,3})-([0-9]{1,3}):([0-9CFLP]{1,3})\.([0-9CFLP]{1,3})\.?([0-9]{0,3})[*&]?([0-9]{0,3})$/);
        //console.log(JSON.stringify(obisArr));
        if (obisArr && obisArr.length > 1) {
            if (obisArr[1] !== '') this.setMedium(obisArr[1]);
            if (obisArr[2] !== '') this.setChannel(obisArr[2]);
            if (obisArr[3] !== '') this.setMeasurement(obisArr[3]);
            if (obisArr[4] !== '') this.setMeasureType(obisArr[4]);
            if (obisArr[5] !== '') this.setTariffRate(obisArr[5]);
            if (obisArr[6] !== '') this.setPreviousMeasurement(obisArr[6]);
        }
        else if (medium.match(/^([0-9A-F]{12})$/)) {
            medium = Buffer.from(medium, 'hex');
        }
        else {
            obisArr = medium.match(/^([0-9CFLP]{1,3})\.?([0-9CFLP]{0,3})\.?([0-9]{0,3})[*&]?([0-9]{0,3})$/);
            if (obisArr && obisArr.length > 1) {
                this.medium = undefined;
                if (obisArr[1] !== '') this.setMeasurement(obisArr[1]);
                if (obisArr[2] !== '') this.setMeasureType(obisArr[2]);
                if (obisArr[3] !== '') this.setTariffRate(obisArr[3]);
                if (obisArr[4] !== '') this.setPreviousMeasurement(obisArr[4]);
            }
            else {
                throw new Error('Invalid Obis String ' + medium);
            }
        }
        if (fallbackMedium !==undefined && this.medium === undefined) {
            this.medium = fallbackMedium;
        }
    }
    if (typeof medium === 'object' && typeof channel === 'undefined') {
        if (Buffer.isBuffer(medium) || Array.isArray(medium)) {
            if (medium.length === 6) {
                this.setMedium(medium[0]);
                this.setChannel(medium[1]);
                this.setMeasurement(medium[2]);
                this.setMeasureType(medium[3]);
                this.setTariffRate(medium[4]);
                this.setPreviousMeasurement(medium[5]);
            }
            else {
                throw new Error('Invalid Buffer length ' + medium.toString('hex'));
            }
        }
        else {
            throw new Error('Invalid Data provided to constructor ');
        }
    }
}

/*
    full = return with set values
    base = ignore medium and channel
    extended = also include previousMeasurement
*/
ObisMeasurement.prototype.idToString = function idToString(content) {
    var fullContent = (content === undefined || content === 'full');
    var extendedContent = (content === undefined || content === 'full' || content === 'extended');

    var obisStr = '';
    if ((fullContent || extendedContent) && this.medium !== undefined) {
        obisStr += this.medium + '-' + ((this.channel === undefined)? '0' : this.channel);
    }
    if (this.measurement !== undefined) {
        if (obisStr.length > 0) obisStr += ':';
        obisStr += this.measurement;
        if (this.measureType !== undefined) {
            obisStr += '.' + this.measureType;
            if (this.tariffRate !== undefined) {
                obisStr += '.' + this.tariffRate;
            }
        }
        if (fullContent && this.previousMeasurement !== undefined) obisStr += '*' + this.previousMeasurement;
    }
    return obisStr;
};

ObisMeasurement.prototype.valueToString = function valueToString() {
    var valueStr = '';
    for (var i = 0; i< this.values.length; i++) {
        valueStr += this.values[i].value;
        if (this.values[i].unit) valueStr += ' ' + this.values[i].unit;
        valueStr += ', ';
    }
    return valueStr.substring(0, valueStr.length-2);
};

ObisMeasurement.prototype.setMedium = function setMedium(value) {
    this.medium = parseInt(value, 10);
};

ObisMeasurement.prototype.getMedium = function getMedium() {
    return this.medium;
};

ObisMeasurement.prototype.setChannel = function setChannel(value) {
    this.channel = parseInt(value, 10);
};

ObisMeasurement.prototype.getChannel = function getChannel() {
    return this.channel;
};

ObisMeasurement.prototype.setMeasurement = function setMeasurement(value) {
    switch (value) {
        case 'C': value = '96';
                  break;
        case 'F': value = '97';
                  break;
        case 'L': value = '98';
                  break;
        case 'P': value = '99';
                  break;
    }
    this.measurement = parseInt(value, 10);
};

ObisMeasurement.prototype.getMeasurement = function getMeasurement() {
    return this.measurement;
};

ObisMeasurement.prototype.setMeasureType = function setMeasureType(value) {
    switch (value) {
        case 'C': value = '96';
                  break;
        case 'F': value = '97';
                  break;
        case 'L': value = '98';
                  break;
        case 'P': value = '99';
                  break;
    }
    this.measureType = parseInt(value, 10);
};

ObisMeasurement.prototype.getMeasureType = function getMeasureType() {
    return this.measureType;
};

ObisMeasurement.prototype.setTariffRate = function setTariffRate(value) {
    this.tariffRate = parseInt(value, 10);
};

ObisMeasurement.prototype.getTariffRate = function getTariffRate() {
    return this.tariffRate;
};

ObisMeasurement.prototype.setPreviousMeasurement = function setPreviousMeasurement(value) {
    this.previousMeasurement = parseInt(value, 10);
};

ObisMeasurement.prototype.getPreviousMeasurement = function getPreviousMeasurement() {
    return this.previousMeasurement;
};

ObisMeasurement.prototype.setRawValue = function setRawValue(rawvalue) {
    this.rawValue = rawvalue;
};

ObisMeasurement.prototype.getRawValue = function getRawValue() {
    return this.rawValue;
};

ObisMeasurement.prototype.addValue = function addValue(value, unit) {
    if (typeof value === 'string') {
        var valueFloat = parseFloat(value);
        if (valueFloat.toString() === value) { // it is a float
            value = valueFloat;
        }
    }
    else if (Buffer.isBuffer(value) || Array.isArray(value)) {
        var printableString=true;
        for (var j=0; j < value.length; j++) {
            if (value[j] < 32 || value[j] > 126) {
                printableString = false;
                break;
            }
        }
        if (printableString) value = value.toString();
            else value = value.toString('hex');
    }
    if (typeof unit !== 'number') {
        var unitInt = parseInt(unit, 10);
        if (unitInt.toString() === unit) { // it is a number
            unit = unitInt;
        }
    }
    if (((typeof unit === 'number') && (!unit)) || unit === undefined) {
        unit = 255;
    }
    if ((unit === 30) && (typeof value === 'number')) { // Wh -> kWh
        value = value / 1000;
        value = parseFloat(value.toFixed(10));
        unit = 'kWh';
    }
    else if (typeof unit === 'number') {
        if (typeof value === 'number') {
            value = parseFloat(value.toFixed(10));
        }
        unit = SmlUnit.resolveUnit(unit);
    }
    //console.log(value + ' ' + unit);
    this.values.push({'value': value, 'unit': unit});
};

ObisMeasurement.prototype.getValues = function getValues() {
    return this.values;
};

ObisMeasurement.prototype.getValueLength = function getValueLength() {
    return this.values.length;
};

ObisMeasurement.prototype.getValue = function getValue(index) {
    if (this.values[index]) return this.values[index];
    return null;
};

module.exports = ObisMeasurement;
