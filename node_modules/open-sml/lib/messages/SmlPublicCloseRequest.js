/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../Constants');

function SmlPublicCloseRequest(){
	this.globalSignature = undefined;
}

SmlPublicCloseRequest.prototype.getGlobalSignature = function getGlobalSignature(){
	return this.globalSignature;
};

SmlPublicCloseRequest.prototype.setGlobalSignature = function setGlobalSignature(value){
	this.globalSignature = value;
};

SmlPublicCloseRequest.prototype.getSize = function getSize(){
	var size = 8;

	if(this.globalSignature){
		size += this.globalSignature.lenght;
	}

	return size;
};

SmlPublicCloseRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.PUBLIC_CLOSE_REQUEST, Constants.UINT32);
	buffer.writeTLField(0x71); // SEQUENZ

	if(this.globalSignature !== undefined){
		buffer.writeOctetString(this.globalSignature);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlPublicCloseRequest.prototype.toString = function toString(){
	var str = "";
	str += "Global Signature: "+this.globalSignature+"\n";
	return str;
};

SmlPublicCloseRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x01){
		var smlPublicCloseRequest = new SmlPublicCloseRequest();
		smlPublicCloseRequest.setGlobalSignature(buffer.readOctetString());
		return smlPublicCloseRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlPublicCloseRequest!");
	}
};

module.exports = SmlPublicCloseRequest;
