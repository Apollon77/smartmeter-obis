/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTime = require('./data_structures/SmlTime');
var Constants = require('../Constants');

function SmlPublicOpenResponse(){
	this.codepage = undefined;
	this.clientId = undefined;
	this.reqFileId = undefined;
	this.serverId = undefined;
	this.refTime = undefined;
	this.smlVersion = 1;
}

SmlPublicOpenResponse.prototype.getCodepage = function getCodepage(){
	return this.codepage;
};

SmlPublicOpenResponse.prototype.setCodepage = function setCodepage(value){
	this.codepage = value;
};

SmlPublicOpenResponse.prototype.getClientId = function getClientId(){
	return this.clientId;
};

SmlPublicOpenResponse.prototype.setClientId = function setClientId(value){
	this.clientId = value;
};

SmlPublicOpenResponse.prototype.getReqFileId = function getReqFileId(){
	return this.reqFileId;
};

SmlPublicOpenResponse.prototype.setReqFileId = function setReqFileId(value){
	this.reqFileId = value;
};

SmlPublicOpenResponse.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlPublicOpenResponse.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlPublicOpenResponse.prototype.getRefTime = function getRefTime(){
	return this.refTime;
};

SmlPublicOpenResponse.prototype.setRefTime = function setRefTime(value){
	this.refTime = value;
};

SmlPublicOpenResponse.prototype.getSmlVersion = function getSmlVersion(){
	return this.smlVersion;
};

SmlPublicOpenResponse.prototype.setSmlVersion = function setSmlVersion(value){
	this.smlVersion = value;
};

SmlPublicOpenResponse.prototype.getSize = function getSize(){
	var size = 12;

	if(this.codepage){
		size += this.codepage.length;
	}

	if(this.clientId){
		size += this.clientId.length;
	}

	size += this.reqFileId.length;
	size += this.serverId.length;

	if(this.refTime){
		size += this.refTime.getSize();
	} else {
		size += 1;
	}

	if(this.smlVersion){
		size += 1;
	}
	//console.log("PublicOpenRes. size: "+size);

	return size;
};

SmlPublicOpenResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.PUBLIC_OPEN_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x76); // SEQUENZ
	if(this.codepage !== undefined){
		buffer.writeOctetString(this.codepage);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.clientId !== undefined){
		buffer.writeOctetString(this.clientId);
	} else {
		buffer.writeUInt8(0x01);
	}

	buffer.writeOctetString(this.reqFileId);
	buffer.writeOctetString(this.serverId);

	if(this.refTime !== undefined){
		this.refTime.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.smlVersion !== undefined){
		buffer.writeUnsigned(this.smlVersion, Constants.UINT8);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlPublicOpenResponse.prototype.toString = function toString(){
	var str = "\t\tSmlPublicOpenResponse\n";
	str += "\t\t\tCodepage: "+this.codepage+"\n";
	str += "\t\t\tClient-ID: "+(this.clientId?this.clientId.toString('hex'):this.clientId)+"\n";
	str += "\t\t\tReq-FileId: "+this.reqFileId+ (this.reqFileId ? " ("+this.reqFileId.toString('hex'):"")+")\n";
	str += "\t\t\tServer-ID: "+(this.serverId?this.serverId.toString('hex'):this.serverId)+"\n";
	if(this.refTime!==undefined){
		str += "\t\t\t"+(this.refTime?this.refTime.toString():this.refTime);
	}
	str += "\t\t\tSml-Version: "+this.smlVersion+"\n";
	return str;
};

SmlPublicOpenResponse.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x06){
		var smlPublicOpenResponse = new SmlPublicOpenResponse();
		smlPublicOpenResponse.setCodepage(buffer.readOctetString());
		smlPublicOpenResponse.setClientId(buffer.readOctetString());
		smlPublicOpenResponse.setReqFileId(buffer.readOctetString());
		smlPublicOpenResponse.setServerId(buffer.readOctetString());
		smlPublicOpenResponse.setRefTime(SmlTime.parse(buffer));
		smlPublicOpenResponse.setSmlVersion(buffer.readUnsigned());
		return smlPublicOpenResponse;
	} else {
		throw new Error("Unknown TL-Field for SmlPublicOpenResponse!");
	}
};

module.exports = SmlPublicOpenResponse;
