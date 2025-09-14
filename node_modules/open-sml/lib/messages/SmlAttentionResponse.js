/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlTree = require('./data_structures/SmlTree');
var Constants = require('../Constants');

function SmlAttentionResponse(){
	this.serverId = undefined;
	this.attentionNo = undefined;
	this.attentionMsg = undefined;
	this.attentionDetails = undefined;
}

SmlAttentionResponse.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlAttentionResponse.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlAttentionResponse.prototype.getAttentionNo = function getAttentionNo(){
	return this.AttentionNo;
};

SmlAttentionResponse.prototype.setAttentionNo = function setAttentionNo(value){
	this.attentionNo = value;
};

SmlAttentionResponse.prototype.getAttentionMsg = function getAttentionMsg(){
	return this.attentionMsg;
};

SmlAttentionResponse.prototype.setAttentionMsg = function setAttentionMsg(value){
	this.attentionMsg = value;
};

SmlAttentionResponse.prototype.getAttentionDetails = function getAttentionDetails(){
	return this.attentionDetails;
};

SmlAttentionResponse.prototype.setAttentionDetails = function setAttentionDetails(value){
	this.attentionDetails = value;
};

SmlAttentionResponse.prototype.getSize = function getSize(){
	var size = 10;

	size += this.serverId.length;
	size += this.attentionNo.length;

	if(this.attentionMsg){
		size += this.attentionMsg.length;
	}

	size += this.attentionDetails.getSize();

	return size;
};

SmlAttentionResponse.prototype.write = function write(buffer){
	buffer.writeChoice(Constants.ATTENTION_RESPONSE, Constants.UINT32);
	buffer.writeTLField(0x74); // SEQUENZ
	buffer.writeOctetString(this.serverId);
	buffer.writeOctetString(this.attentionNo);
	if(this.attentionMsg !== undefined){
		buffer.writeOctetString(this.attentionMsg);
	} else {
		buffer.writeUInt8(0x01);
	}
	if(this.attentionDetails !== undefined){
		this.attentionDetails.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlAttentionResponse.prototype.toString = function toString(){
	var str = "";
	str += "Server-ID: "+this.serverId+"\n";
	str += "Attention-No.: "+this.attentionNo+"\n";
	str += "Attention-Msg.: "+this.attentionMsg+"\n";
	str += "Attention Details: "+(this.attentionDetails ? this.attentionDetails.toString() : this.attentionDetails)+"\n";
	return str;
};

SmlAttentionResponse.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x04){
		var smlAttentionResponse = new SmlAttentionResponse();
		smlAttentionResponse.setServerId(buffer.readOctetString());
		smlAttentionResponse.setAttentionNo(buffer.readOctetString());
		smlAttentionResponse.setAttentionMsg(buffer.readOctetString());
		smlAttentionResponse.setAttentionDetails(SmlTree.parse(buffer));
		return smlAttentionResponse;
	} else {
		throw new Error("Unknown TL-Field for SmlAttentionResponse!");
	}
};

module.exports = SmlAttentionResponse;
