/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */
var Constants = require('../../Constants');

function SmlValueListEntry(){
	this.value = undefined;
	this.valueType = undefined;
	this.valueSignature = undefined;
}

SmlValueListEntry.prototype.getValue = function getValue(){
	return this.value;
};

SmlValueListEntry.prototype.setValue = function setValue(value){
	this.value = value;
};

SmlValueListEntry.prototype.getValueType = function getValueType(){
	return this.valueType;
};

SmlValueListEntry.prototype.setValueType = function setValueType(value){
	this.value = value;
};

SmlValueListEntry.prototype.getValueSignature = function getValueSignature(){
	return this.valueSignature;
};

SmlValueListEntry.prototype.setValueSignature = function setValueSignature(value){
	this.valueSignature = value;
};

SmlValueListEntry.prototype.getSize = function getSize(){
	var size = 2;

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

	if(this.valueSignature !== undefined){
		size += this.valueSignature.length;
	}
	return size;
};

SmlValueListEntry.prototype.write = function write(buffer){
	buffer.writeTLField(0x72); // SEQUENZ
	buffer.writeSmlValue(this.value, this.valueType);

	if(this.valueSignature !== undefined){
		buffer.writeOctetString(this.valueSignature);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlValueListEntry.prototype.toString = function toString(){
	var str = "";
	str += "SML-Value: "+this.value+"\n";
	str += "Value-Signature: "+this.valueSignature+"\n";
	return str;
};

SmlValueListEntry.parse = function parse(buffer){
	var smlValueListEntry = new SmlValueListEntry();
	var tlField = buffer.readTLField();

	if(tlField.type != 0x07 && tlField.length != 0x04){
		throw new Error("Unknown TL-Field for SmlValueListEntry!");
	}

	smlValueEntry.setValue(buffer.readSmlValue());
	smlValueEntry.setValueSignature(buffer.readOctetString());
    smlValueEntry.setValueType(buffer.lastReadValueType);

	return smlValueEntry;
};

module.exports = SmlValueListEntry;
