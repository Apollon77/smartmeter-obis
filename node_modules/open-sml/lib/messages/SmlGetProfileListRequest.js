/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlObjReqList = require('./data_structures/SmlObjReqList');
var SmlTreePath = require('./data_structures/SmlTreePath');
var SmlTime = require('./data_structures/SmlTime');
var SmlTree = require('./data_structures/SmlTree');
var Constants = require('../Constants');

function SmlGetProfileListRequest(){
	this.serverId = undefined;
	this.username = undefined;
	this.password = undefined;
	this.withRawdata = undefined;
	this.beginTime = undefined;
	this.endTime = undefined;
	this.parameterTreePath = undefined;
	this.objectList = undefined;
	this.dasDetails = undefined;
}

SmlGetProfileListRequest.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetProfileListRequest.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetProfileListRequest.prototype.getUsername = function getUsername(){
	return this.username;
};

SmlGetProfileListRequest.prototype.setUsername = function setUsername(value){
	this.username = value;
};

SmlGetProfileListRequest.prototype.getPassword = function getPassword(){
	return this.password;
};

SmlGetProfileListRequest.prototype.setPassword = function setPassword(value){
	this.password = value;
};

SmlGetProfileListRequest.prototype.isWithRawdata = function isWithRawdata(){
	return this.withRawdata;
};

SmlGetProfileListRequest.prototype.setWithRawdata = function setWithRawdata(value){
	this.withRawdata = value;
};

SmlGetProfileListRequest.prototype.getBeginTime = function getBeginTime(){
	return this.beginTime;
};

SmlGetProfileListRequest.prototype.setBeginTime = function setBeginTime(value){
	this.beginTime = value;
};

SmlGetProfileListRequest.prototype.getEndTime = function getEndTime(){
	return this.endTime;
};

SmlGetProfileListRequest.prototype.setEndTime = function setEndTime(value){
	this.endTime = value;
};

SmlGetProfileListRequest.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlGetProfileListRequest.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlGetProfileListRequest.prototype.getObjectList = function getObjectList(){
	return this.objectList;
};

SmlGetProfileListRequest.prototype.setObjectList = function setObjectList(value){
	this.objectList = value;
};

SmlGetProfileListRequest.prototype.getDasDetails = function getDasDetails(){
	return this.dasDetails;
};

SmlGetProfileListRequest.prototype.setDasDetails = function setDasDetails(value){
	this.dasDetails = value;
};

SmlGetProfileListRequest.prototype.getSize = function getSize(){
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
	if(this.withRawdata){
		size += 1;
	}
	if(this.beginTime){
		size += this.beginTime.getSize();
	}
	if(this.endTime){
		size += this.endTime.getSize();
	}
	size += this.parameterTreePath.getSize();

	if(this.objectList){
		size += this.objectList.getSize();
	}
	if(this.dasDetails){
		size += this.dasDetails.getSize();
	}

	return size;
};


SmlGetProfileListRequest.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_PROFILE_LIST_REQUEST, Constants.UINT32);
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

SmlGetProfileListRequest.prototype.toString = function toString(){
	var str = "SmlGetProfileListRequest\n";
	str += "\tServer-ID: "+this.serverId+"\n";
	str += "\tUsername: "+this.username+"\n";
	str += "\tPassword: "+this.password+"\n";
	str += "\tWith Rawdata: "+this.withRawdata+"\n";
	str += "\tBegin Time: "+(this.beginTime?this.beginTime.toString():this.beginTime)+"\n";
	str += "\tEnd Time: "+(this.endTime?this.endTime.toString():this.endTime)+"\n";
	str += "\tParameter Tree-Path: "+(this.parameterTreePath?this.parameterTreePath.toString():this.parameterTreePath)+"\n";
	str += "\tObject List: "+(this.objectList?this.objectList.toString():this.objectList)+"\n";
	str += "\tDAS Details: "+this.dasDetails+"\n";
	return str;
};

SmlGetProfileListRequest.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x09){
		var smlGetProfileListRequest = new SmlGetProfileListRequest();
		smlGetProfileListRequest.setServerId(buffer.readOctetString());
		smlGetProfileListRequest.setUsername(buffer.readOctetString());
		smlGetProfileListRequest.setPassword(buffer.readOctetString);
		smlGetProfileListRequest.setWithRawdata(buffer.readSmlBoolean());
		smlGetProfileListRequest.setBeginTime(SmlTime.parse(buffer));
		smlGetProfileListRequest.setEndTime(SmlTime.parse(buffer));
		smlGetProfileListRequest.setParamaterTreePath(SmlTreePath.parse(buffer));
		smlGetProfileListRequest.setObjectList(SmlObjReqList.parse(buffer));
		smlGetProfileListRequest.setDasDetails(SmlTree.parse(buffer));

		return smlGetProfileListRequest;
	} else {
		throw new Error("Unknown TL-Field for SmlGetProfileListRequest!");
	}
};

module.exports = SmlGetProfileListRequest;
