/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTreePath = require('./data_structures/SmlTreePath');
var SmlTree = require('./data_structures/SmlTree');
var Constants = require('../Constants');

function SmlSetProcParameterRequest(){
	this.serverId = undefined;
	this.username = undefined;
	this.password = undefined;
	this.parameterTreePath = undefined;
	this.parameterTree = undefined;
}

SmlSetProcParameterRequest.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlSetProcParameterRequest.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlSetProcParameterRequest.prototype.getUsername = function getUsername(){
	return this.username;
};

SmlSetProcParameterRequest.prototype.setUsername = function setUsername(value){
	this.username = value;
};

SmlSetProcParameterRequest.prototype.getPassword = function getPassword(){
	return this.password;
};

SmlSetProcParameterRequest.prototype.setPassword = function setPassword(value){
	this.password = value;
};

SmlSetProcParameterRequest.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlSetProcParameterRequest.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlSetProcParameterRequest.prototype.getParameterTree = function getParameterTree(){
	return this.parameterTree;
};

SmlSetProcParameterRequest.prototype.setParameterTree = function setParameterTree(value){
	this.parameterTree = value;
};

SmlSetProcParameterRequest.prototype.getSize = function getSize(){
	var size = 10;

	if(this.serverId !== undefined){
		size += this.serverId.lenght;
	}
	if(this.username !== undefined){
		size += this.username.lenght;
	}
	if(this.password !== undefined){
		size += this.password.lenght;
	}

	size += this.parameterTreePath.getSize();
	size += this.parameterTree.getSize();

	return size;
};

SmlSetProcParameterRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.SET_PROC_PARAMETER_REQUEST, Constants.UINT32);
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
	this.parameterTree.write(buffer);
};

SmlSetProcParameterRequest.prototype.toString = function toString(){
	var str = "";
	str += "Server ID: "+this.serverId+"\n";
	str += "Username: "+this.username+"\n";
	str += "Password: "+this.password+"\n";
	str += "Parameter Tree-Path: "+(this.parameterTreePath ? this.parameterTreePath.toString() : this.parameterTreePath)+"\n";
	str += "Parameter Tree: "+(this.parameterTree ? this.parameterTree.toString() : this.parameterTree)+"\n";
	return str;
};

SmlSetProcParameterRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x05){
		var smlSetProcParameterRequest = new SmlSetProcParameterRequest();
		smlSetProcParameterRequest.setServerId(buffer.readOctetString());
		smlSetProcParameterRequest.setUsername(buffer.readOctetString());
		smlSetProcParameterRequest.setPassword(buffer.readOctetString);
		smlSetProcParameterRequest.setParameterTreePath(SmlTreePath.parse(buffer));
		smlSetProcParameterRequest.setParameterTree(SmlTree.parse(buffer));

		return smlSetProcParameterRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlSetProcParameterRequest!");
	}
};

module.exports = SmlSetProcParameterRequest;
