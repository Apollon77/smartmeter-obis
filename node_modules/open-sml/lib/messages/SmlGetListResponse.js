/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTime = require('./data_structures/SmlTime');
var SmlList = require('./data_structures/SmlList');
var Constants = require('../Constants');

function SmlGetListResponse(){
	this.clientId = undefined;
	this.serverId = undefined;
	this.listName = undefined;
	this.actSensorTime = undefined;
	this.valList = undefined;
	this.listSignature = undefined;
	this.actGatewayTime = undefined;
}

SmlGetListResponse.prototype.getClientId = function getClientId(){
	return this.clientId;
};

SmlGetListResponse.prototype.setClientId = function setClientId(value){
	this.clientId = value;
};

SmlGetListResponse.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlGetListResponse.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlGetListResponse.prototype.getListName = function getListName(){
	return this.listName;
};

SmlGetListResponse.prototype.setListName = function setListName(value){
	this.listName = value;
};

SmlGetListResponse.prototype.getActSensorTime = function getActSensorTime(){
	return this.actSensorTime;
};

SmlGetListResponse.prototype.setActSensorTime = function setActSensorTime(value){
	this.actSensorTime = value;
};

SmlGetListResponse.prototype.getValList = function getValList(){
	return this.valList;
};

SmlGetListResponse.prototype.setValList = function setValList(value){
	this.valList = value;
};

SmlGetListResponse.prototype.getListSignature = function getListSignature(){
	return this.listSignature;
};

SmlGetListResponse.prototype.setListSignature = function setListSignature(value){
	this.listSignature = value;
};

SmlGetListResponse.prototype.getActGatewayTime = function getActGatewayTime (){
	return this.actGatewayTime;
};

SmlGetListResponse.prototype.setActGatewayTime  = function setActGatewayTime (value){
	this.actGatewayTime = value;
};

SmlGetListResponse.prototype.getSize = function getSize(){
	var size = 11;

	if(this.clientId){
		size += this.clientId.length;
	}
	size += this.serverId.length;

	if(this.listName){
		size += this.listName.length;
	}

	size += this.actSensorTime.getSize();
	size += this.valList.getSize();

	if(this.listSignature){
		size += this.listSignature.length;
	}

	size += this.actGatewayTime.getSize();

	return size;
};

SmlGetListResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.GET_LIST_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x77); // SEQUENZ

	if(this.clientId !== undefined){
		buffer.writeOctetString(this.clientId);
	} else {
		buffer.writeUInt8(0x01);
	}
	buffer.writeOctetString(this.serverId);

	if(this.listName !== undefined){
		buffer.writeOctetString(this.listName);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.actSensorTime !== undefined){
		this.actSensorTime.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}

	this.valList.write(buffer);

	if(this.listSignature !== undefined){
		this.listSignature.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}
	if(this.actGatewayTime !== undefined){
		this.actGatewayTime.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlGetListResponse.prototype.toString = function toString(){
	var str = "\t\tSmlGetListResponse\n";
	str += "\t\t\tClient-ID: "+this.clientId+"\n";
	str += "\t\t\tServer-ID: "+this.serverId+"\n";
	str += "\t\t\tList-Name: "+this.listName+"\n";
	str += "\t\t\tAct-Sensor-Time: "+(this.actSensorTime?this.actSensorTime.toString():this.actSensorTime)+"\n";
	str += "\t\t\tValList: "+(this.valList?this.valList.toString():this.valList)+"\n";
	str += "\t\t\tList-Signature: "+this.listSignature+"\n";
	str += "\t\t\tAct-Gateway-Time: "+(this.actGatewayTime?this.actGatewayTime.toString():this.actGatewayTime)+"\n";
	return str;
};

SmlGetListResponse.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x07){
		var smlGetListResponse = new SmlGetListResponse();
		smlGetListResponse.setClientId(buffer.readOctetString());
		smlGetListResponse.setServerId(buffer.readOctetString());
		smlGetListResponse.setListName(buffer.readOctetString());
		smlGetListResponse.setActSensorTime(SmlTime.parse(buffer));
		smlGetListResponse.setValList(SmlList.parse(buffer));
		smlGetListResponse.setListSignature(buffer.readOctetString());
		smlGetListResponse.setActGatewayTime(SmlTime.parse(buffer));
		return smlGetListResponse;
	} else {
		throw new Error("Unknown TL-Field for SmlGetListResponse!");
	}
};

module.exports = SmlGetListResponse;
