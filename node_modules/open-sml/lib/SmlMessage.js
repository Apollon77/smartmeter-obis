/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlBuffer = require('./SmlBuffer');
var Constants = require('./Constants');
var SmlMessageBody = require('./SmlMessageBody');
var Crc16 = require("./SmlCRC");

function SmlMessage(){
	this.messageTag = undefined;
	this.transactionId = undefined;
	this.groupNo = 0x00;
	this.abortOnError = 0x00;
	this.messageBody = undefined;
	this.crc16 = 0x0000;
    this.valid=false;
}

SmlMessage.prototype.getTransactionId = function getTransactionId(){
	return this.transactionId;
};

SmlMessage.prototype.setTransactionId = function setTransactionId(value){
	this.transactionId = value;
};

SmlMessage.prototype.getGroupNo = function getGroupNo(){
	return this.groupNo;
};

SmlMessage.prototype.setGroupNo = function setGroupNo(value){
	this.groupNo = value;
};

SmlMessage.prototype.getAbortOnError = function getAbortOnError(){
	return this.abortOnError;
};

SmlMessage.prototype.setAbortOnError = function setAbortOnError(value){
	this.abortOnError = value;
};

SmlMessage.prototype.getMessageBody = function getMessageBody(){
	return this.messageBody;
};

SmlMessage.prototype.setMessageBody = function setMessageBody(value){
	this.messageBody = value;
};

SmlMessage.prototype.getCRC16 = function getCRC16(){
	return this.crc16;
};

SmlMessage.prototype.setCRC16 = function setCRC16(value){
	this.crc16 = value;
};

SmlMessage.prototype.isValid = function isValid(){
	return this.valid;
};

SmlMessage.prototype.setValid = function setValid(value){
	this.valid = value;
};

SmlMessage.prototype.getMessageTag = function getMessageTag(){
	return this.messageTag;
};

SmlMessage.prototype.setMessageTag = function setMessageTag(value){
	this.messageTag = value;
};

SmlMessage.prototype.getSize = function getSize(){
	var size = 10;
	size += this.transactionId.length;
	size += this.messageBody.getSize();

	//console.log("Message. size: "+size);
	return size;
};

SmlMessage.prototype.toString = function toString(){
	var str = "\tSTART SmlMessage\n";
	str += "\t\tTransaction-ID: "+this.transactionId+" ("+(this.transactionId ? this.transactionId.toString('hex') : this.transactionId)+")\n";
	str += "\t\tGroup-No: "+this.groupNo+"\n";
	str += "\t\tAbort On Error: "+this.abortOnError+"\n";
	str += "\t\tMessage-Body: "+(this.messageBody ? this.messageBody.toString() : this.messageBody);
	str += "\t\tCRC 16: "+(this.valid?"valid":"INVALID")+"\n";
	str += "\tEND SmlMessage\n";
	return str;
};

SmlMessage.prototype.write = function write(buffer){
    var smlMessageStart = buffer.offset;
    buffer.writeTLField(0x76); // ListOf 0x7z

	buffer.writeOctetString(this.transactionId);
	buffer.writeUnsigned(this.groupNo, Constants.UINT8);
	buffer.writeUnsigned(this.abortOnError, Constants.UINT8);
	this.messageBody.write(buffer);

    //console.log("MSG="+buffer.buffer.slice(smlMessageStart,buffer.offset).toString('hex'))
    var crcCalc=Crc16.crc16CCITTRotate(buffer.buffer.slice(smlMessageStart,buffer.offset));

	buffer.writeUnsigned(crcCalc, Constants.UINT16);
	buffer.writeUInt8(0x00);
};

SmlMessage.parse = function parse(buffer){
	var smlMessage = new SmlMessage();

    var smlMessageStart = buffer.offset;
	if(buffer.readTLField()==0x07,0x06){
        smlMessage.setTransactionId(buffer.readOctetString());
		smlMessage.setGroupNo(buffer.readUnsigned());
		smlMessage.setAbortOnError(buffer.readUnsigned());
		var messageTag = buffer.readChoice();
		smlMessage.setMessageTag(messageTag);

		smlMessage.setMessageBody(SmlMessageBody.parse(buffer, messageTag));

        //console.log("MSG="+buffer.buffer.slice(smlMessageStart,buffer.offset).toString('hex'))
        smlMessage.setCRC16(buffer.readUnsigned());
        var crcCalc=Crc16.crc16CCITT(buffer.buffer.slice(smlMessageStart,buffer.offset-3));
        //console.log("CRC16-Compare Msg="+smlMessage.getCRC16().toString(16)+", Calculated="+crcCalc.toString(16));
        if (smlMessage.getCRC16() == crcCalc){
            smlMessage.setValid(true);
        }
        else {
            crcCalc=Crc16.crc16CCITTRotate(buffer.buffer.slice(smlMessageStart,buffer.offset-3));
            //console.log("CRC16-Compare-Rotated Msg="+smlMessage.getCRC16().toString(16)+", Calculated="+crcCalc.toString(16));
            if (smlMessage.getCRC16() == crcCalc){
                smlMessage.setValid(true);
			} else {
				// Workaround for Holley DTZ541 uses CRC-16/Kermit
				crcCalc = Crc16.crc16Kermit(buffer.buffer.slice(smlMessageStart, buffer.offset - 3));
				smlMessage.setValid(smlMessage.getCRC16() === crcCalc);
			}
		}
        //console.log("Message CRC Valid: "+smlMessage.isValid());
	} else {
		throw new Error("Unknown TL-Field for SmlMessage!");
	}

	return smlMessage;
};

module.exports = SmlMessage;
