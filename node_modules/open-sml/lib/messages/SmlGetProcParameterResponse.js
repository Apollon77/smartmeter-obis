/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTreePath = require('./data_structures/SmlTreePath');
var SmlTree = require('./data_structures/SmlTree');
var Constants = require('../Constants');

function SmlGetProcParameterResponse(){
	this.serverId = undefined;
	this.parameterTreePath = undefined;
	this.parameterTree = undefined;
}

SmlGetProcParameterResponse.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetProcParameterResponse.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetProcParameterResponse.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlGetProcParameterResponse.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlGetProcParameterResponse.prototype.getParameterTree = function getParameterTree(){
	return this.parameterTree;
};

SmlGetProcParameterResponse.prototype.setParameterTree = function setParameterTree(value){
	this.parameterTree = value;
};

SmlGetProcParameterResponse.prototype.getSize = function getSize(){
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


SmlGetProcParameterResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_PROC_PARAMETER_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x73); // SEQUENZ

	buffer.writeOctetString(this.serverId);
	this.parameterTreePath.write(buffer);
	this.parameterTree.write(buffer);
};

SmlGetProcParameterResponse.prototype.toString = function toString(){
	var str = "\t\tSmlGetProcParameterResponse\n";
	str += "\t\t\tServer-ID: "+(this.serverId?this.serverId.toString('hex'):this.serverId)+"\n";
	str += "\t\t\tParameter-Tree-Path: "+(this.parameterTreePath?this.parameterTreePath.toString():this.parameterTreePath)+"\n";
	str += "\t\t\tParameter-Tree: "+(this.parameterTree?this.parameterTree.toString():this.parameterTree)+"\n";
	return str;
};

SmlGetProcParameterResponse.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x03){
		var smlGetProcParameterResponse = new SmlGetProcParameterResponse();
		smlGetProcParameterResponse.setServerId(buffer.readOctetString());
		smlGetProcParameterResponse.setParameterTreePath(SmlTreePath.parse(buffer));
		smlGetProcParameterResponse.setParameterTree(SmlTree.parse(buffer));
		return smlGetProcParameterResponse;
	} else {
		throw new Error("Unknown TL-Field for SmlGetProcParameterResponse!");
	}
};

module.exports = SmlGetProcParameterResponse;
