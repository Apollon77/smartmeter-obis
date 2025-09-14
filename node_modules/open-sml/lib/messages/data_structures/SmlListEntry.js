/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../../Constants');
var SmlTime = require('./SmlTime');

function SmlListEntry(){
	this.objName = undefined;
	this.status = undefined;
	this.statusType = undefined;
	this.valTime = undefined;
	this.unit = undefined;
	this.scaler = undefined;
	this.value = undefined;
	this.valueType = undefined;
	this.valueSignature = undefined;
}

SmlListEntry.prototype.getObjName = function getObjName(){
	return this.objName;
};

SmlListEntry.prototype.setObjName = function setObjName(value){
	this.objName = value;
};

SmlListEntry.prototype.getStatus = function getStatus(){
	return this.status;
};

SmlListEntry.prototype.setStatus = function setStatus(value){
	this.status = value;
};

SmlListEntry.prototype.getStatusType = function getStatusType(){
	return this.statusType;
};

SmlListEntry.prototype.setStatusType = function setStatusType(value){
	this.statusType = value;
};

SmlListEntry.prototype.getValTime = function getValTime(){
	return this.valTime;
};

SmlListEntry.prototype.setValTime = function setValTime(value){
	this.valTime = value;
};

SmlListEntry.prototype.getUnit = function getUnit(){
	return this.unit;
};

SmlListEntry.prototype.setUnit = function setUnit(value){
	this.unit = value;
};

SmlListEntry.prototype.getScaler = function getScalar(){
	return this.scaler;
};

SmlListEntry.prototype.setScaler = function setScalar(value){
	this.scaler = value;
};

SmlListEntry.prototype.getValue = function getValue(){
	return this.value;
};

SmlListEntry.prototype.setValue = function setValue(value){
	this.value = value;
};

SmlListEntry.prototype.getValueType = function getValueType(){
	return this.valueType;
};

SmlListEntry.prototype.setValueType = function setValueType(value){
	this.valueType = value;
};

SmlListEntry.prototype.getValueSignature = function getValueSignature(){
	return this.valueSignature;
};

SmlListEntry.prototype.setValueSignature = function setValueSignature(value){
	this.valueSignature = value;
};

SmlListEntry.prototype.getSize = function getSize(){
	var size = 5;
	size += this.objName.length;

	if(this.valTime){
		size += this.valTime.getSize();
	} else {
		size += 1;
	}
	if(this.unit !== undefined){
		size += 1;
	}
	if(this.scaler !== undefined){
		size += 1;
	}

	if(this.valueType==Constants.BOOLEAN || this.valueType==Constants.UINT8 || this.valueType==Constants.INT8){
		size += 1;
	} else if(this.valueType==Constants.UINT16 || this.valueType==Constants.INT16){
		size += 2;
	} else if(this.valueType==Constants.UINT32 || this.valueType==Constants.INT32){
		size += 4;
	} else if(this.valueType==Constants.UINT64 || this.valueType==Constants.INT64){
		size += 8;
	} else if (this.value && this.value.length){
        size+= this.value.length;
    }

	if(this.statusType==Constants.UINT8){
		size += 1;
	} else if(this.statusType==Constants.UINT16){
		size += 2;
	} else if(this.statusType==Constants.UINT32){
		size += 4;
	} else if(this.statusType==Constants.UINT64){
		size += 8;
	}

	if(this.valueSignature !== undefined){
		size += this.valueSignature.length;
	}

	return size;
};

SmlListEntry.prototype.write = function write(buffer){
	buffer.writeTLField(0x77); // SEQUENZ
	buffer.writeOctetString(this.objName);

	if(this.status !== undefined){
		buffer.writeUnsigned(this.status, this.statusType);
	} else {
		buffer.writeUInt8(0x01);
	}

    if(this.valTime !== undefined){
		this.valTime.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}

    if(this.unit !== undefined){
		buffer.writeUnsigned(this.unit, Constants.UINT8 );
	} else {
		buffer.writeUInt8(0x01);
	}

    if(this.scaler !== undefined){
		buffer.writeInteger(this.scaler, Constants.INT8);
	} else {
		buffer.writeUInt8(0x01);
	}

    buffer.writeSmlValue(this.value, this.valueType);

    if(this.valueSignature !== undefined){
		buffer.writeOctetString(this.valueSignature);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlListEntry.prototype.toString = function toString(){
	var str = "";
	str += "\tObj-Name: "+(this.objName[0] !== undefined ? this.objName[0].toString(10) : 'undefined')+"-"+
		(this.objName[1] !== undefined ? this.objName[1].toString(10) : 'undefined')+":"+
		(this.objName[2] !== undefined ? this.objName[2].toString(10) : 'undefined')+"."+
		(this.objName[3] !== undefined ? this.objName[3].toString(10) : 'undefined')+"."+
		(this.objName[4] !== undefined ? this.objName[4].toString(10) : 'undefined')+"*"+
		(this.objName[5] !== undefined ? this.objName[5].toString(10) : 'undefined')+"\n";
	str += "\tStatus: "+(this.status?this.status.toString(16):this.status)+"\n";
	str += "\tVal-Time: "+(this.valTime?this.valTime.toString():this.valTime)+"\n";
	str += "\tUnit: "+this.unit+"\n";
	str += "\tScaler: "+this.scaler+"\n";
	if((this.unit==255 || this.unit===undefined) && this.value !==undefined){
		if (this.value instanceof Buffer) str += "\tValue: "+this.value.toString()+" / "+this.value.toString('hex')+"\n";
          else str += "\tValue: "+this.value.toString()+" / "+this.value.toString(16)+"\n";
	} else {
		str += "\tValue: "+this.value+"\n";
	}
	str += "\tValue-Signature: "+(this.valueSignature?this.valueSignature.toString('hex'):this.valueSignature)+"\n";
	return str;
};

SmlListEntry.parse = function parse(buffer){
	var smlListEntry = new SmlListEntry();
	var tlField = buffer.readTLField();

	if(tlField.type != 0x07 && tlField.length != 0x07){
		throw new Error("Unknown TL-Field for SmlListEntry!");
	}

	smlListEntry.setObjName(buffer.readOctetString());
	smlListEntry.setStatus(buffer.readUnsigned());
    smlListEntry.setStatusType(buffer.lastReadValueType);
	smlListEntry.setValTime(SmlTime.parse(buffer));
	smlListEntry.setUnit(buffer.readUnsigned());
	smlListEntry.setScaler(buffer.readInteger());
	smlListEntry.setValue(buffer.readSmlValue());
    smlListEntry.setValueType(buffer.lastReadValueType);
	smlListEntry.setValueSignature(buffer.readOctetString());

	return smlListEntry;
};

module.exports = SmlListEntry;
