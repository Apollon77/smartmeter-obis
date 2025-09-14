/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */
var Constants = require('../Constants');

function SmlGetListRequest(){
	this.clientId = undefined;
	this.serverId = undefined;
	this.username = undefined;
	this.password = undefined;
	this.listName = undefined;
}

SmlGetListRequest.prototype.getClientId = function getClientId(){
	return this.clientId;
};

SmlGetListRequest.prototype.setClientId = function setClientId(value){
	this.clientId = value;
};

SmlGetListRequest.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetListRequest.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetListRequest.prototype.getUsername = function getUsername(){
	return this.username;
};

SmlGetListRequest.prototype.setUsername = function setUsername(value){
	this.username = value;
};

SmlGetListRequest.prototype.getPassword = function getPassword(){
	return this.password;
};

SmlGetListRequest.prototype.setPassword = function setPassword(value){
	this.password = value;
};

SmlGetListRequest.prototype.getListName = function getListName(){
	return this.listName;
};

SmlGetListRequest.prototype.setListName = function setListName(value){
	this.listName = value;
};

SmlGetListRequest.prototype.getSize = function getSize(){
	var size = 12;

	size += this.clientId.length;

	if(this.serverId){
		size += this.serverId.length;
	}
	if(this.username){
		size += this.username.length;
	}
	if(this.password){
		size += this.password.length;
	}
	if(this.listName){
		size += this.listName.length;
	}

	return size;
};

SmlGetListRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_LIST_REQUEST, Constants.UINT32);
	buffer.writeTLField(0x75); // SEQUENZ

	buffer.writeOctetString(this.clientId);

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
	if(this.listName !== undefined){
		buffer.writeOctetString(this.listName);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlGetListRequest.prototype.toString = function toString(){
	var str = "";
	str += "Client-ID: "+this.clientId+"\n";
	str += "Server-ID: "+this.serverId+"\n";
	str += "Username: "+this.username+"\n";
	str += "Password: "+this.password+"\n";
	str += "List-Name: "+this.listName+"\n";
	return str;
};

SmlGetListRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x05){
		var smlGetListRequest = new SmlGetListRequest();
		smlGetListRequest.setClientId(buffer.readOctetString());
		smlGetListRequest.setServerId(buffer.readOctetString());
		smlGetListRequest.setUsername(buffer.readOctetString());
		smlGetListRequest.setPassword(buffer.readOctetString());
		smlGetListRequest.setListName(buffer.readOctetString());
		return smlGetListRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlGetListRequest!");
	}
};

module.exports = SmlGetListRequest;
