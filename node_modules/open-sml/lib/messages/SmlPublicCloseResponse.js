/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../Constants');

function SmlPublicCloseResponse(){
	this.globalSignature = undefined;
}

SmlPublicCloseResponse.prototype.getGlobalSignature = function getGlobalSignature(){
	return this.globalSignature;
};

SmlPublicCloseResponse.prototype.setGlobalSignature = function setGlobalSignature(value){
	this.globalSignature = value;
};

SmlPublicCloseResponse.prototype.getSize = function getSize(){
	var size = 8;
	if(this.globalSignature){
		size += this.globalSignature.length;
	}

	//console.log("PublicCloseRes. size: "+size);
	return size;
};

SmlPublicCloseResponse.prototype.toString = function toString(){
	var str = "\t\tSmlPublicCloseResponse\n";
	if(this.globalSignature){
		str += "\t\t\tGlobal Signature: "+this.globalSignature+"\n";
	} else {
		str += "\t\t\tGlobal Signature: \n";
	}
	return str;
};

SmlPublicCloseResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.PUBLIC_CLOSE_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x71); // SEQUENZ
	if(this.globalSignature !== undefined){
		buffer.writeOctetString(this.globalSignature);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlPublicCloseResponse.parse = function parse(buffer){

	if(buffer.readTLField()==0x07,0x01){
		var smlPublicCloseResponse = new SmlPublicCloseResponse();
		smlPublicCloseResponse.setGlobalSignature(buffer.readOctetString());
		return smlPublicCloseResponse;
	} else {
		throw new Error("Unknown TL-Field for SmlPublicCloseResponse!");
	}
};

module.exports = SmlPublicCloseResponse;
