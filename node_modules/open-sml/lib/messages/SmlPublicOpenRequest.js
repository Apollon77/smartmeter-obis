/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../Constants');

function SmlPublicOpenRequest(){
	this.codepage = undefined;
	this.clientId = undefined;
	this.reqFileId = undefined;
	this.serverId = undefined;
	this.username = undefined;
	this.password = undefined;
	this.smlVersion = undefined;
}

SmlPublicOpenRequest.prototype.getCodepage = function getCodepage(){
	return this.codepage;
};

SmlPublicOpenRequest.prototype.setCodepage = function setCodepage(value){
	this.codepage = value;
};

SmlPublicOpenRequest.prototype.getClientId = function getClientId(){
	return this.clientId;
};

SmlPublicOpenRequest.prototype.setClientId = function setClientId(value){
	this.clientId = value;
};

SmlPublicOpenRequest.prototype.getReqFileId = function getReqFileId(){
	return this.reqFileId;
};

SmlPublicOpenRequest.prototype.setReqFileId = function setReqFileId(value){
	this.regFileId = value;
};

SmlPublicOpenRequest.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlPublicOpenRequest.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlPublicOpenRequest.prototype.getUsername = function getUsername(){
	return this.username;
};

SmlPublicOpenRequest.prototype.setUsername = function setUsername(value){
	this.username = value;
};

SmlPublicOpenRequest.prototype.getPassword = function getPassword(){
	return this.password;
};

SmlPublicOpenRequest.prototype.setPassword = function setPassword(value){
	this.password = value;
};

SmlPublicOpenRequest.prototype.getSmlVersion = function getSmlVersion(){
	return this.smlVersion;
};

SmlPublicOpenRequest.prototype.setSmlVersion = function setSmlVersion(value){
	this.smlVersion = value;
};

SmlPublicOpenRequest.prototype.getSize = function getSize(){
	var size = 14;

	if(this.codepage !== undefined){
		size += this.codepage.lenght;
	}

	size += this.clientId.length;
	size += this.reqFileId.length;

	if(this.serverId !== undefined){
		size += this.serverId.lenght;
	}
	if(this.username !== undefined){
		size += this.username.lenght;
	}
	if(this.password !== undefined){
		size += this.password.lenght;
	}
	if(this.smlVersion !== undefined){
		size += 1;
	}

	return size;
};

SmlPublicOpenRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.PUBLIC_OPEN_REQUEST, Constants.UINT32);
	buffer.writeTLField(0x77); // SEQUENZ

	if(this.codepage !== undefined){
		buffer.writeOctetString(this.codepage);
	} else {
		buffer.writeUInt8(0x01);
	}

	buffer.writeOctetString(this.clientId);
	buffer.writeOctetString(this.reqFileId);

	if(this.serverId !== undefined){
		buffer.writeOctetString(this.serverId);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.username !== undefined){
		buffer.writeOctetString(this.username);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.password !== undefined){
		buffer.writeOctetString(this.password);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.smlVersion !== undefined){
		buffer.writeUnsigned(this.smlVersion, Constants.UINT8);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlPublicOpenRequest.prototype.toString = function toString(){
	var str = "";
	str += "Codepage: "+this.codepage+"\n";
	str += "Client ID: "+this.clientId+"\n";
	str += "Req-FileID: "+this.reqFileId+"\n";
	str += "Server ID: "+this.serverId+"\n";
	str += "Username: "+this.username+"\n";
	str += "Password: "+this.password+"\n";
	str += "SML Version: "+this.smlVersion+"\n";
	return str;
};

SmlPublicOpenRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x07){
		var smlPublicOpenRequest = new SmlPublicOpenRequest();
		smlPublicOpenRequest.setCodepage(buffer.readOctetString());
		smlPublicOpenRequest.setClientId(buffer.readOctetString());
		smlPublicOpenRequest.setReqFileId(buffer.readOctetString());
		smlPublicOpenRequest.setServerId(buffer.readOctetString());
		smlPublicOpenRequest.setUsername(buffer.readOctetString());
		smlPublicOpenRequest.setPassword(buffer.readOctetString());
		smlPublicOpenRequest.setSmlVersion(buffer.readUnsigned());

		return smlPublicOpenRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlPublicOpenRequest!");
	}
};

module.exports = SmlPublicOpenRequest;
