/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */
var Constants = require('../Constants');

function SmlGetProfilePackResponse(){
	this.serverId = undefined;
	this.actTime = undefined;
	this.regPeriod = undefined;
	this.parameterTreePath = undefined;
	this.headerList = undefined;
	this.periodList = undefined;
	this.rawdata = undefined;
	this.profileSignature = undefined;
}

SmlGetProfilePackResponse.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetProfilePackResponse.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetProfilePackResponse.prototype.getActTime = function getActTime(){
	return this.actTime;
};

SmlGetProfilePackResponse.prototype.setActTime = function setActTime(value){
	this.actTime = value;
};

SmlGetProfilePackResponse.prototype.getRegPeriod = function getRegPeriod(){
	return this.regPeriod;
};

SmlGetProfilePackResponse.prototype.setRegPeriod = function setRegPeriod(value){
	this.regPeriod = value;
};

SmlGetProfilePackResponse.prototype.getParameterTreePath = function getParameterTreePath(){
	return this.parameterTreePath;
};

SmlGetProfilePackResponse.prototype.setParameterTreePath = function setParameterTreePath(value){
	this.parameterTreePath = value;
};

SmlGetProfilePackResponse.prototype.getHeaderList = function getHeaderList(){
	return this.headerList;
};

SmlGetProfilePackResponse.prototype.setHeaderList = function setHeaderList(value){
	this.headerList = value;
};

SmlGetProfilePackResponse.prototype.getPeriodList = function getPeriodList(){
	return this.periodList;
};

SmlGetProfilePackResponse.prototype.setPeriodList = function setPeriodList(value){
	this.periodList = value;
};

SmlGetProfilePackResponse.prototype.getRawdata = function getRawdata(){
	return this.rawdata;
};

SmlGetProfilePackResponse.prototype.setRawdata = function setRawdata(value){
	this.rawdata = value;
};

SmlGetProfilePackResponse.prototype.getProfileSignature = function getProfileSignature(){
	return this.profileSignature;
};

SmlGetProfilePackResponse.prototype.setProfileSignature = function setProfileSignature(value){
	this.profileSignature = value;
};

SmlGetProfilePackResponse.prototype.getSize = function getSize(){
	var size = 15;

	size += this.serverId.length;
	size += this.actTime.getSize();
	size += this.parameterTreePath.getSize();
	size += this.headerList.getSize();
	size += this.periodList.getSize();

	if(this.rawdata){
		size += this.rawdata.length;
	}
	if(this.profileSignature){
		size += this.profileSignature.lenght;
	}

	return size;
};

SmlGetProfilePackResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_PROFILE_PACK_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x78); // SEQUENZ

	buffer.writeOctetString(this.serverId);
	this.actTime.write(buffer);
	buffer.writeUnsigned(this.regPeriod, Constants.UINT32);
	this.parameterTreePath.write(buffer);
	this.headerList.write(buffer);
	this.periodList.write(buffer);

	if(this.rawdata !== undefined){
		buffer.writeOctetString(this.rawdata);
	} else{
		buffer.writeUInt8(0x01);
	}

	if(this.profileSignature !== undefined){
		buffer.writeOctetString(this.profileSignature);
	} else{
		buffer.writeUInt8(0x01);
	}

};

SmlGetProfilePackResponse.prototype.toString = function toString(){
	var str = "";
	str += "Server-ID: "+this.serverId+"\n";
	str += "Act Time: "+(this.actTime?this.actTime.toString():this.actTime)+"\n";
	str += "Reg Period: "+this.regPeriod+"\n";
	str += "Parameter Tree-Path: "+(this.parameterTreePath?this.parameterTreePath.toString():this.parameterTreePath)+"\n";
	str += "Header List: "+(this.headerList?this.headerList.toString():this.headerList)+"\n";
	str += "Period List: "+(this.periodList?this.periodList.toString():this.periodList)+"\n";
	str += "With Rawdata: "+(this.withRawdata?this.withRawdata.toString():this.withRawdata)+"\n";
	str += "Profile Signature: "+this.profileSignature+"\n";
	return str;
};

SmlGetProfilePackResponse.parse = function parse(buffer){
var smlGetProfilePackResponse = new SmlGetProfilePackResponse();

	if(buffer.readTLField()==0x07,0x08){
		smlGetProfilePackResponse.setServerId(buffer.readOctetString());
		smlGetProfilePackResponse.setActTime(SmlTime.parse(buffer));
		smlGetProfilePackResponse.setRegPeriod(buffer.readUnsigned());
		smlGetProfilePackResponse.setParameterTreePath(SmlTreePath.parse(buffer));
		smlGetProfilePackResponse.setHeaderList(SmlTime.parse(buffer));
		smlGetProfilePackResponse.setPeriodList(SmlPeriodList.parse(buffer));
		smlGetProfilePackResponse.setWithRawdata(buffer.readUnsigned());
		smlGetProfilePackResponse.setProfileSignature(buffer.readOctetString());

	} else {
		throw new Error("Unknown TL-Field for SmlGetProfilePackResponse!");
	}

	return smlGetProfileListResponse;
};

module.exports = SmlGetProfilePackResponse;
