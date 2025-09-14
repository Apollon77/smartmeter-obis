/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */
var Constants = require('../Constants');

function SmlGetProfilePackRequest(){
	this.serverId = undefined;
	this.username = undefined;
	this.password = undefined;
	this.withRawdata = undefined;
	this.beginTime = undefined;
	this.endTime = undefined;
	this.parameterTreePath = undefined;
	this.dasDetails = undefined;
}

SmlGetProfilePackRequest.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetProfilePackRequest.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetProfilePackRequest.prototype.getUsername = function getUsername(){
	return this.username;
};

SmlGetProfilePackRequest.prototype.setUsername = function setUsername(value){
	this.username = value;
};

SmlGetProfilePackRequest.prototype.getPassword = function getPassword(){
	return this.password;
};

SmlGetProfilePackRequest.prototype.setPassword = function setPassword(value){
	this.password = value;
};

SmlGetProfilePackRequest.prototype.isWithRawdata = function isWithRawdata(){
	return this.withRawdata;
};

SmlGetProfilePackRequest.prototype.setWithRawdata = function setWithRawdata(value){
	this.withRawdata = value;
};

SmlGetProfilePackRequest.prototype.getBeginTime = function getBeginTime(){
	return this.beginTime;
};

SmlGetProfilePackRequest.prototype.setBeginTime = function setBeginTime(value){
	this.beginTime = value;
};

SmlGetProfilePackRequest.prototype.getEndTime = function getEndTime(){
	return this.endTime;
};

SmlGetProfilePackRequest.prototype.setEndTime = function setEndTime(value){
	this.endTime = value;
};

SmlGetProfilePackRequest.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlGetProfilePackRequest.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlGetProfilePackRequest.prototype.getDasDetails = function getDasDetails(){
	return this.dasDetails;
};

SmlGetProfilePackRequest.prototype.setDasDetails = function setDasDetails(value){
	this.dasDetails = value;
};

SmlGetProfilePackRequest.prototype.getSize = function getSize(){
	var size = 11;

	if(this.serverId !== undefined){
		size += this.serverId.length;
	}
	if(this.username !== undefined){
		size += this.username.length;
	}
	if(this.password !== undefined){
		size += this.password.length;
	}
	if(this.withRawdata !== undefined){
		size += 1;
	}
	if(this.beginTime !== undefined){
		size += this.beginTime.getSize();
	} else {
		size+=1;
	}
	if(this.endTime !== undefined){
		size += this.endTime.getSize();
	} else {
		size +=1;
	}
	size += this.parameterTreePath.getSize();

	if(this.objectList){
		size += this.objectList.getSize();
	} else {
		size += 1;
	}
	if(this.dasDetails){
		size += this.dasDetails.getSize();
	} else {
		size += 1;
	}

	return size;
};

SmlGetProfilePackRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_PROFILE_PACK_REQUEST, Constants.UINT32);
	buffer.writeTLField(0x79); // SEQUENZ

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

	if(this.withRawdata !== undefined){
		buffer.writeSmlBoolean(this.withRawdata);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.beginTime !== undefined){
		this.beginTime.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.endTime !== undefined){
		this.endTime.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}

	this.parameterTreePath.write(buffer);

	if(this.objectList !== undefined){
		for(var object in this.objectList){
			this.objectList[object].write(buffer);
		}
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.dasDetails !== undefined){
		this.dasDetails.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlGetProfilePackRequest.prototype.toString = function toString(){
	var str = "";
	str += "Server-ID: "+this.serverId+"\n";
	str += "Username: "+this.username+"\n";
	str += "Password: "+this.password+"\n";
	str += "With Rawdata: "+this.withRawdata+"\n";
	str += "Begin Time: "+(this.beginTime?this.beginTime.toString():this.beginTime)+"\n";
	str += "End Time: "+(this.endTime?this.endTime.toString():this.endTime)+"\n";
	str += "Parameter Tree-Path: "+(this.parameterTreePath?this.parameterTreePath.toString():this.parameterTreePath)+"\n";
	str += "DAS Details: "+this.dasDetails+"\n";
	return str;
};

SmlGetProfilePackRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x08){
		var smlGetProfilePackRequest = new SmlGetProfilePackRequest();
		smlGetProfilePackRequest.setServerId(buffer.readOctetString());
		smlGetProfilePackRequest.setUsername(buffer.readOctetString());
		smlGetProfilePackRequest.setPassword(buffer.readOctetString);
		smlGetProfilePackRequest.setWithRawdata(buffer.readSmlBoolean());
		smlGetProfilePackRequest.setBeginTime(SmlTime.parse(buffer));
		smlGetProfilePackRequest.setEndTime(SmlTime.parse(buffer));
		smlGetProfilePackRequest.setParamaterTreePath(SmlTreePath.parse(buffer));
		smlGetProfilePackRequest.setDasDetails(SmlTree.parse(buffer));

		return smlGetProfilePackRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlGetProfilePackRequest!");
	}
};

module.exports = SmlGetProfilePackRequest;
