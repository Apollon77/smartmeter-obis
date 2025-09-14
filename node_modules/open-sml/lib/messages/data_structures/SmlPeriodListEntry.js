/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../../Constants');

function SmlPeriodListEntry(){
	this.objName = undefined;
	this.unit = undefined;
	this.scaler = undefined;
	this.value = undefined;
	this.valueType = undefined;
	this.valueSignature = undefined;
}

SmlPeriodListEntry.prototype.getObjName = function getObjName(){
	return this.objName;
};

SmlPeriodListEntry.prototype.setObjName = function setObjName(value){
	this.objName = value;
};

SmlPeriodListEntry.prototype.getUnit = function getUnit(){
	return this.unit;
};

SmlPeriodListEntry.prototype.setUnit = function setUnit(value){
	this.unit = value;
};

SmlPeriodListEntry.prototype.getScaler = function getScaler(){
	return this.scaler;
};

SmlPeriodListEntry.prototype.setScaler = function setScaler(value){
	this.scaler = value;
};

SmlPeriodListEntry.prototype.getValue = function getValue(){
	return this.value;
};

SmlPeriodListEntry.prototype.setValue = function setValue(value){
	this.value = value;
};

SmlPeriodListEntry.prototype.getValueType = function getValueType(){
	return this.valueType;
};

SmlPeriodListEntry.prototype.setValueType = function setValueType(value){
	this.valueType = value;
};


SmlPeriodListEntry.prototype.getValueSignature = function getValueSignature(){
	return this.valueSignature;
};

SmlPeriodListEntry.prototype.setValueSignature = function setValueSignature(value){
	this.valueSignature = value;
};

SmlPeriodListEntry.prototype.getSize = function getSize(){
	var size = 8;
	size += this.objName.length;

	if(this.valueSignature){
		size += this.valueSignature.length;
	}
    else size+=1;

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

	return size;
};

SmlPeriodListEntry.prototype.write = function write(buffer){
	buffer.writeTLField(0x75); // SEQUENZ
	buffer.writeOctetString(this.objName);
	buffer.writeUnsigned(this.unit, Constants.UINT8);
	buffer.writeInteger(this.scaler, Constants.INT8);
	buffer.writeSmlValue(this.value, this.valueType);

	if(this.valueSignature !== undefined){
		buffer.writeOctetString(this.valueSignature);
	} else {
		buffer.writeUInt8(0x01);
	}

};

SmlPeriodListEntry.prototype.toString = function toString(){
	var str = "";
	str += "\t\t\t\tObj-Name: "+this.objName[0].toString(10)+"-"+
                                this.objName[1].toString(10)+":"+
                                this.objName[2].toString(10)+"."+
                                this.objName[3].toString(10)+"."+
                                this.objName[4].toString(10)+"*"+
                                this.objName[5].toString(10)+"\n";
	str += "\t\t\t\tUnit: "+this.unit+"\n";
	str += "\t\t\t\tScaler: "+this.scaler+"\n";
	if(this.unit==255 && this.value !==undefined){
		str += "\t\t\t\tValue: "+this.value.toString()+" / "+this.value.toString('hex')+"\n";
	} else {
		str += "\t\t\t\tValue: "+this.value+"\n";
	}
	if(this.valueSignature){
		str += "\t\t\t\tValue-Signature: "+this.valueSignature.toString(16)+"\n";
	} else {
		str += "\t\t\t\tValue-Signature: \n";
	}
	return str;
};

SmlPeriodListEntry.parse = function parse(buffer){

	var smlPeriodListEntry = new SmlPeriodListEntry();
	var tlField = buffer.readTLField();

	if(tlField.type != 0x07){
		throw new Error("Unknown TL-Field for SmlPeriodListEntry!");
	}

	smlPeriodListEntry.setObjName(buffer.readOctetString());
	smlPeriodListEntry.setUnit(buffer.readUnsigned());
	smlPeriodListEntry.setScaler(buffer.readInteger());
    smlPeriodListEntry.setValue(buffer.readSmlValue());
    smlPeriodListEntry.setValueType(buffer.lastReadValueType);
	smlPeriodListEntry.setValueSignature(buffer.readOctetString());

	return smlPeriodListEntry;

};

module.exports = SmlPeriodListEntry;
