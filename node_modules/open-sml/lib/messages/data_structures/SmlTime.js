/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../../Constants');

function SmlTime(){
	this.secIndex = undefined;
	this.timestamp = undefined;
}

SmlTime.prototype.getSecIndex = function getSecIndex(){
	return this.secIndex;
};

SmlTime.prototype.setSecIndex = function setSecIndex(value){
	this.secIndex = value;
};

SmlTime.prototype.getTimestamp = function getTimestamp(){
	return this.timestamp;
};

SmlTime.prototype.setTimestamp = function setTimestamp(value){
	this.timestamp = value;
};

SmlTime.prototype.getSize = function getSize(){
	var size = 8;
	return size;
};

SmlTime.prototype.toString = function toString(){
	var str = "";
	if(this.secIndex !== undefined){
		str += "(Sec-Index): "+this.secIndex+"\n";
	} else if(this.timestamp !== undefined){
		str += "(Timestamp): "+this.timestamp+"\n";
	} else {
		str += "";
	}
	return str;
};

SmlTime.prototype.write = function write(buffer){
	if(this.secIndex === undefined && this.timestamp === undefined){
		buffer.writeUInt8(0x01);
	} else {
		if(this.secIndex !== undefined){
			buffer.writeChoice(Constants.SEC_INDEX, Constants.UINT8);
			buffer.writeUnsigned(this.secIndex, Constants.UINT32);
		} else {
			buffer.writeChoice(Constants.TIMESTAMP, Constants.UINT8);
			buffer.writeUnsigned(this.timestamp, Constants.UINT32);
		}
	}
};

SmlTime.parse = function parse(buffer){
	var smlTime = new SmlTime();

	var choice = buffer.readChoice();

	if(choice==0x01){
		smlTime.secIndex = buffer.readUnsigned();
	} else if(choice==0x02){
		smlTime.timestamp = buffer.readUnsigned();
	}

	return smlTime;
};

module.exports = SmlTime;
