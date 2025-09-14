/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTreePath = require('./data_structures/SmlTreePath');
var SmlPeriodList = require('./data_structures/SmlPeriodList');
var SmlTime = require('./data_structures/SmlTime');
var Constants = require('../Constants');

function SmlGetProfileListResponse(){
	this.serverId = undefined;
	this.actTime = undefined;
	this.regPeriod = undefined;
	this.parameterTreePath = undefined;
	this.valTime = undefined;
	this.status = undefined;
	this.periodList = undefined;
	this.rawdata = undefined;
	this.periodSignature = undefined;
}

SmlGetProfileListResponse.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetProfileListResponse.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetProfileListResponse.prototype.getActTime = function getActTime(){
	return this.actTime;
};

SmlGetProfileListResponse.prototype.setActTime = function setActTime(value){
	this.actTime = value;
};

SmlGetProfileListResponse.prototype.getRegPeriod = function getRegPeriod(){
	return this.regPeriod;
};

SmlGetProfileListResponse.prototype.setRegPeriod = function setRegPeriod(value){
	this.regPeriod = value;
};

SmlGetProfileListResponse.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlGetProfileListResponse.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlGetProfileListResponse.prototype.getValTime = function getValTime(){
	return this.valTime;
};

SmlGetProfileListResponse.prototype.setValTime = function setValTime(value){
	this.valTime = value;
};

SmlGetProfileListResponse.prototype.getStatus = function getStatus(){
	return this.status;
};

SmlGetProfileListResponse.prototype.setStatus = function setStatus(value){
	this.status = value;
};

SmlGetProfileListResponse.prototype.getPeriodList = function getPeriodList(){
	return this.periodList;
};

SmlGetProfileListResponse.prototype.setPeriodList = function setPeriodList(value){
	this.periodList = value;
};

SmlGetProfileListResponse.prototype.getRawdata = function getRawdata(){
	return this.rawdata;
};

SmlGetProfileListResponse.prototype.setRawdata = function setRawdata(value){
	this.rawdata = value;
};

SmlGetProfileListResponse.prototype.getPeriodSignature = function getPeriodSignature(){
	return this.periodSignature;
};

SmlGetProfileListResponse.prototype.setPeriodSignature = function setPeriodSignature(value){
	this.periodSignature = value;
};

SmlGetProfileListResponse.prototype.getSize = function getSize(){
	var size = 24;
	size += this.serverId.length;
	size += this.actTime.getSize();
	size += this.parameterTreePath.getSize();
	size += this.valTime.getSize();
	size += this.periodList.getSize();

	if(this.rawdata){
		size += this.rawdata.length;
	}

	if(this.perodSignature){
		size += this.perodSignature.length;
	}
	//console.log("GetProfileListRes. size: "+size);

	return size;
};

SmlGetProfileListResponse.prototype.toString = function toString(){
	var str = "\t\tSmlGetProfileListResponse\n";
	str += "\t\t\tServer-ID: "+(this.serverId?this.serverId.toString('hex'):this.serverId)+"\n";
	str += "\t\t\tAct-Time: "+(this.actTime?this.actTime.toString():this.actTime);
	str += "\t\t\tReg-Period: "+this.regPeriod+"\n";
	str += "\t\t\tParameter-Tree-Path: "+(this.parameterTreePath?this.parameterTreePath.toString():this.parameterTreePath)+"\n";
	str += "\t\t\tVal-Time: "+(this.valTime?this.valTime.toString():this.valTime);
	str += "\t\t\tStatus: "+this.status+"\n";
	str += "\t\t\tPeriod-List: "+(this.periodList?this.periodList.toString():this.periodList)+"\n";

	if(this.rawdata){
		str += "\t\t\tRaw-Data: "+this.rawdata.toString('hex')+"\n";
	} else {
		str += "\t\t\tRaw-Data: \n";
	}
	str += "\t\t\tPeriod-Signature: "+this.periodSignature+"\n";
	return str;
};

SmlGetProfileListResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_PROFILE_LIST_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x79); // SEQUENZ
	buffer.writeOctetString(this.serverId);
	this.actTime.write(buffer);
	buffer.writeUnsigned(this.regPeriod, Constants.UINT32);
	this.parameterTreePath.write(buffer);
	this.valTime.write(buffer);
	buffer.writeUnsigned(this.status, Constants.UINT64);
	this.periodList.write(buffer);

	if(this.rawdata !== undefined){
		buffer.writeOctetString(this.rawdata);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.periodSignature !== undefined){
		buffer.writeOctetString(this.periodSignature);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlGetProfileListResponse.parse = function parse(buffer){
	var smlGetProfileListResponse = new SmlGetProfileListResponse();
	if(buffer.readTLField()==0x07,0x09){
		smlGetProfileListResponse.setServerId(buffer.readOctetString());
		smlGetProfileListResponse.setActTime(SmlTime.parse(buffer));
		smlGetProfileListResponse.setRegPeriod(buffer.readUnsigned());
		smlGetProfileListResponse.setParameterTreePath(SmlTreePath.parse(buffer));
		smlGetProfileListResponse.setValTime(SmlTime.parse(buffer));
		smlGetProfileListResponse.setStatus(buffer.readUnsigned());
		smlGetProfileListResponse.setPeriodList(SmlPeriodList.parse(buffer));
		smlGetProfileListResponse.setRawdata(buffer.readOctetString());
		smlGetProfileListResponse.setPeriodSignature(buffer.readOctetString());

	} else {
		throw new Error("Unknown TL-Field for SmlGetProfileListResponse!");
	}

	return smlGetProfileListResponse;
};

module.exports = SmlGetProfileListResponse;
