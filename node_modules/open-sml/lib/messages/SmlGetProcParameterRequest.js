/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTreePath = require('./data_structures/SmlTreePath');
var Constants = require('../Constants');

function SmlGetProcParameterRequest(){
	this.serverId = undefined;
	this.username = undefined;
	this.password = undefined;
	this.parameterTreePath = undefined;
	this.attribute = undefined;
}

SmlGetProcParameterRequest.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetProcParameterRequest.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetProcParameterRequest.prototype.getUsername = function getUsername(){
	return this.username;
};

SmlGetProcParameterRequest.prototype.setUsername = function setUsername(value){
	this.username = value;
};

SmlGetProcParameterRequest.prototype.getPassword = function getPassword(){
	return this.password;
};

SmlGetProcParameterRequest.prototype.setPassword = function setPassword(value){
	this.password = value;
};

SmlGetProcParameterRequest.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlGetProcParameterRequest.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlGetProcParameterRequest.prototype.getAttribute = function getAttribute(){
	return this.attribute;
};

SmlGetProcParameterRequest.prototype.setAttribute = function setAttribute(value){
	this.attribute = value;
};

SmlGetProcParameterRequest.prototype.getSize = function getSize(){
	var size = 11;

	if(this.serverId){
		size += this.serverId.length;
	}
	if(this.username){
		size += this.username.length;
	}
	if(this.password){
		size += this.password.length;
	}

	size += this.parameterTreePath.getSize();

	if(this.attribute){
		size += this.sttribute.length;
	}

	return size;
};

SmlGetProcParameterRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_PROC_PARAMETER_REQUEST, Constants.UINT32);
	buffer.writeTLField(0x75); // SEQUENZ

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

	this.parameterTreePath.write(buffer);

	if(this.attribute !== undefined){
		buffer.writeOctetString(this.attribute);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlGetProcParameterRequest.prototype.toString = function toString(){
	var str = "";
	str += "Server-ID: "+this.serverId+"\n";
	str += "Username: "+this.username+"\n";
	str += "Password: "+this.password+"\n";
	str += "Parameter-Tree-Path: "+(this.parameterTreePath?this.parameterTreePath.toString():this.parameterTreePath)+"\n";
	str += "Attribute: "+this.attribute+"\n";
	return str;
};

SmlGetProcParameterRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x05){
		var smlGetProcParameterRequest = new SmlGetProcParameterRequest();
		smlGetProcParameterRequest.setServerId(buffer.readOctetString());
		smlGetProcParameterRequest.setUsername(buffer.readOctetString());
		smlGetProcParameterRequest.setPassword(buffer.readOctetString);
		smlGetProcParameterRequest.setParameterTreePath(SmlTreePath.parse(buffer));
		smlGetProcParameterRequest.setAttribute(buffer.readOctetString());
		return smlGetProcParameterRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlGetProcParameterRequest!");
	}
};

module.exports = SmlGetProcParameterRequest;
