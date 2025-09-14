/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../../Constants');

function SmlProfObjHeaderListEntry(){
	this.objName = undefined;
	this.unit = undefined;
	this.scaler = undefined;
}

SmlProfObjHeaderListEntry.prototype.getObjName = function getObjName(){
	return this.objName;
};

SmlProfObjHeaderListEntry.prototype.setObjName = function setObjName(value){
	this.objName = value;
};

SmlProfObjHeaderListEntry.prototype.getUnit = function getUnit(){
	return this.unit;
};

SmlProfObjHeaderListEntry.prototype.setUnit = function setUnit(value){
	this.unit = value;
};

SmlProfObjHeaderListEntry.prototype.getScalar = function getScalar(){
	return this.scaler;
};

SmlProfObjHeaderListEntry.prototype.setScalar = function setScalar(value){
	this.scaler = value;
};

SmlProfObjHeaderListEntry.prototype.getSize = function getSize(){
	var size = 6;
	size += this.objName.length;
	return size;
};

SmlProfObjHeaderListEntry.prototype.write = function write(buffer){
	buffer.writeTLField(0x73); // SEQUENZ
	buffer.writeOctetString(this.objName);
	buffer.writeUnsigned(this.unit, Constants.UINT8);
	buffer.writeInteger(this.scaler, Constants.INT8);
};

SmlProfObjHeaderListEntry.prototype.toString = function toString(){
	var str = "";
	str += "\tObj-Name: "+(this.objName?this.objName.toString('hex'):this.objName)+"\n";
	str += "\tUnit: "+this.unit+"\n";
	str += "\tScaler: "+this.scaler+"\n";
	return str;
};

SmlProfObjHeaderListEntry.parse = function parse(buffer){
	var smlProfObjHeaderListEntry = new SmlProfObjHeaderListEntry();
	var tlField = buffer.readTLField();

	if(tlField.type != 0x07 && tlField.length != 0x03){
		throw new Error("Unknown TL-Field for SmlProfObjHeaderListEntry!");
	}

	smlProfObjHeaderListEntry.setObjName(buffer.readOctetString());
	smlProfObjHeaderListEntry.setUnit(buffer.readUnsigned());
	smlProfObjHeaderListEntry.setScaler(buffer.readInteger());

	return smlProfObjHeaderListEntry;
};

module.exports = SmlProfObjHeaderListEntry;
