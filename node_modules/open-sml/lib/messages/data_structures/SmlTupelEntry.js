/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */
var Constants = require('../../Constants');

function SmlTupelEntry(){
	this.serverId = undefined;
	this.secIndex = undefined;
	this.status = undefined;
	this.unitPa = undefined;
	this.scalerPa = undefined;
	this.valuePa = undefined;
	this.unitR1 = undefined;
	this.scalerR1 = undefined;
	this.valueR1 = undefined;
	this.unitR4 = undefined;
	this.scalerR4 = undefined;
	this.valueR4 = undefined;
	this.signature_pA_R1_R4 = undefined;
	this.unitMa = undefined;
	this.scalerMa = undefined;
	this.valueMa = undefined;
	this.unitR2 = undefined;
	this.scalerR2 = undefined;
	this.valueR2 = undefined;
	this.unitR3 = undefined;
	this.scalerR3 = undefined;
	this.valueR3 = undefined;
	this.signature_mA_R2_R3 = undefined;
}

SmlTupelEntry.prototype.getServerId = function getServerId(){
	return this.serverId;
};

SmlTupelEntry.prototype.setServerId = function setServerId(value){
	this.serverId = value;
};

SmlTupelEntry.prototype.getSecIndex = function getSecIndex(){
	return this.secIndex;
};

SmlTupelEntry.prototype.setSecIndex = function setSecIndex(value){
	this.secIndex = value;
};

SmlTupelEntry.prototype.getStatus = function getStatus(){
	return this.status;
};

SmlTupelEntry.prototype.setStatus = function setStatus(value){
	this.status = value;
};

SmlTupelEntry.prototype.getUnitPa = function getUnitPa(){
	return this.unitPa;
};

SmlTupelEntry.prototype.setUnitPa = function setUnitPa(value){
	this.unitPa = value;
};

SmlTupelEntry.prototype.getScalerPa = function getScalerPa(){
	return this.scalerPa;
};

SmlTupelEntry.prototype.setScalerPa = function setScalerPa(value){
	this.scalerPa = value;
};

SmlTupelEntry.prototype.getValuePa = function getValuePa(){
	return this.valuePa;
};

SmlTupelEntry.prototype.setValuePa = function setValuePa(value){
	this.valuePa = value;
};

SmlTupelEntry.prototype.getUnitR1 = function getUnitR1(){
	return this.unitR1;
};

SmlTupelEntry.prototype.setUnitR1 = function setUnitR1(value){
	this.unitR1 = value;
};

SmlTupelEntry.prototype.getScalerR1 = function getScalerR1(){
	return this.scalerR1;
};

SmlTupelEntry.prototype.setScalerR1 = function setScalerR1(value){
	this.scalerR1 = value;
};

SmlTupelEntry.prototype.getValueR1 = function getValueR1(){
	return this.valueR1;
};

SmlTupelEntry.prototype.setValueR1 = function setValueR1(value){
	this.valueR1 = value;
};

SmlTupelEntry.prototype.getUnitR4 = function getUnitR4(){
	return this.unitR4;
};

SmlTupelEntry.prototype.setUnitR4 = function setUnitR4(value){
	this.unitR4 = value;
};

SmlTupelEntry.prototype.getScalerR4 = function getScalerR4(){
	return this.scalerR4;
};

SmlTupelEntry.prototype.setScalerR4 = function setScalerR4(value){
	this.scalerR4 = value;
};

SmlTupelEntry.prototype.getValueR4 = function getValueR4(){
	return this.valueR4;
};

SmlTupelEntry.prototype.setValueR4 = function setValueR4(value){
	this.valueR4 = value;
};

SmlTupelEntry.prototype.getSignature_pA_R1_R4 = function getSignature_pA_R1_R4(){
	return this.signature_pA_R1_R4;
};

SmlTupelEntry.prototype.setSignature_pA_R1_R4 = function setSignature_pA_R1_R4(value){
	this.signature_pA_R1_R4 = value;
};

SmlTupelEntry.prototype.getUnitMa = function getUnitMa(){
	return this.unitMa;
};

SmlTupelEntry.prototype.setUnitMa = function setUnitMa(value){
	this.unitMa = value;
};

SmlTupelEntry.prototype.getScalerMa = function getScalerMa(){
	return this.scalerMa;
};

SmlTupelEntry.prototype.setScalerMa = function setScalerMa(value){
	this.scalerMa = value;
};

SmlTupelEntry.prototype.getValueMa = function getValueMa(){
	return this.valueMa;
};

SmlTupelEntry.prototype.setValueMa = function setValueMa(value){
	this.valueMa = value;
};

SmlTupelEntry.prototype.getUnitR2 = function getUnitR2(){
	return this.unitR2;
};

SmlTupelEntry.prototype.setUnitR2 = function setUnitR2(value){
	this.unitR2 = value;
};

SmlTupelEntry.prototype.getScalerR2 = function getScalerR2(){
	return this.scalerR2;
};

SmlTupelEntry.prototype.setScalerR2 = function setScalerR2(value){
	this.scalerR2 = value;
};

SmlTupelEntry.prototype.getValueR2 = function getValueR2(){
	return this.valueR2;
};

SmlTupelEntry.prototype.setValueR2 = function setValueR2(value){
	this.valueR2 = value;
};

SmlTupelEntry.prototype.getUnitR3 = function getUnitR3(){
	return this.unitR3;
};

SmlTupelEntry.prototype.setUnitR3 = function setUnitR3(value){
	this.unitR3 = value;
};

SmlTupelEntry.prototype.getScalerR3 = function getScalerR3(){
	return this.scalerR3;
};

SmlTupelEntry.prototype.setScalerR3 = function setScalerR3(value){
	this.scalerR3 = value;
};

SmlTupelEntry.prototype.getValueR3 = function getValueR3(){
	return this.valueR3;
};

SmlTupelEntry.prototype.setValueR3 = function setValueR3(value){
	this.valueR3 = value;
};

SmlTupelEntry.prototype.getSignature_mA_R2_R3 = function getSignature_mA_R2_R3(){
	return this.signature_mA_R2_R3;
};

SmlTupelEntry.prototype.setSignature_mA_R2_R3 = function setSignature_mA_R2_R3(value){
	this.signature_mA_R2_R3 = value;
};

SmlTupelEntry.prototype.getSize = function getSize(){
	var size = 100;
	size += this.serverId.length;
	size += this.secIndex.getSize();
	size += this.signature_pA_R1_R4.length;
	size += this.signature_mA_R2_R3.length;

	return size;
};

SmlTupelEntry.prototype.write = function write(buffer){
	buffer.writeTLField(0x7, 0x17); // SEQUENZ 23 elements
	buffer.writeOctetString(this.serverId);
	this.secIndex.write(buffer);
	buffer.writeUnsigned(this.status, Constants.UINT64);

	buffer.writeUnsigned(this.unitPa, Constants.UINT8);
	buffer.writeInteger(this.scalerPa, Constants.INT8);
	buffer.writeInteger(this.valuePa, Constants.INT64);

	buffer.writeUnsigned(this.unitR1, Constants.UINT8);
	buffer.writeInteger(this.scalerR1, Constants.INT8);
	buffer.writeInteger(this.valueR1, Constants.INT64);

	buffer.writeUnsigned(this.unitR4, Constants.UINT8);
	buffer.writeInteger(this.scalerR4, Constants.INT8);
	buffer.writeInteger(this.valueR4, Constants.INT64);

	buffer.writeOctetString(this.signature_pA_R1_R4);

	buffer.writeUnsigned(this.unitMa, Constants.UINT8);
	buffer.writeInteger(this.scalerMa, Constants.INT8);
	buffer.writeInteger(this.valueMa, Constants.INT64);

	buffer.writeUnsigned(this.unitR2, Constants.UINT8);
	buffer.writeInteger(this.scalerR2, Constants.INT8);
	buffer.writeInteger(this.valueR2, Constants.INT64);

	buffer.writeUnsigned(this.unitR3, Constants.UINT8);
	buffer.writeInteger(this.scalerR3, Constants.INT8);
	buffer.writeInteger(this.valueR3, Constants.INT64);

	buffer.writeOctetString(this.signature_mA_R2_R3);
};

SmlTupelEntry.prototype.toString = function toString(){
	var str = "";
	str += "Server-Id: "+this.serverId + "\n";
	str += "Sec-Index: "+(this.secIndex?this.secIndex.toString():this.secIndex);
	str += "Status: "+this.serverId + "\n";

	str += "Unit pA: "+ this.unitPa +"\n";
	str += "Scaler pA: "+ this.scalerPa +"\n";
	str += "Value pA: "+ this.valuePa +"\n";

	str += "Unit R1: "+ this.unitR1 +"\n";
	str += "Scaler R1: "+ this.scalerR1 +"\n";
	str += "Value R1: "+ this.valueR1 +"\n";

	str += "Unit R4: "+ this.unitR4 +"\n";
	str += "Scaler R4: "+ this.scalerR4 +"\n";
	str += "Value R4: "+ this.valueR4 +"\n";

	str += "Signature pA_R1_R4: "+ this.signature_pA_R1_R4 +"\n";

	str += "Unit mA: "+ this.unitMa +"\n";
	str += "Scaler mA: "+ this.scalerMa +"\n";
	str += "Value mA: "+ this.valueMa +"\n";

	str += "Unit R2: "+ this.unitR2 +"\n";
	str += "Scaler R2: "+ this.scalerR2 +"\n";
	str += "Value R2: "+ this.valueR2 +"\n";

	str += "Unit R3: "+ this.unitR3 +"\n";
	str += "Scaler R3: "+ this.scalerR3 +"\n";
	str += "Value R3: "+ this.valueR3 +"\n";

	str += "Signature mA_R2_R3: "+ this.signature_mA_R2_R3 +"\n";

	return str;
};

SmlTupelEntry.parse = function parse(buffer){
	if(buffer.readTLField()==0x07,0x17){
		var smlTupelEntry = new SmlTupelEntry();
		smlTupelEntry.setServerId(buffer.readOctetString());
		smlTupelEntry.setSecIndex(SmlTime.parse(buffer));
		smlTupelEntry.setStatus(buffer.readUnsigned());
		smlTupelEntry.setUnitPa(buffer.readUnsigned());
		smlTupelEntry.setScalerPa(buffer.readInteger());
		smlTupelEntry.setValuePa(buffer.readInteger());
		smlTupelEntry.setUnitR1(buffer.readUnsigned());
		smlTupelEntry.setScalerR1(buffer.readInteger());
		smlTupelEntry.setValueR1(buffer.readInteger());
		smlTupelEntry.setUnitR4(buffer.readUnsigned());
		smlTupelEntry.setScalerR4(buffer.readInteger());
		smlTupelEntry.setValueR4(buffer.readInteger());
		smlTupelEntry.setSignature_pA_R1_R4(buffer.readOctetString());
		smlTupelEntry.setUnitMa(buffer.readUnsigned());
		smlTupelEntry.setScalerMa(buffer.readInteger());
		smlTupelEntry.setValueMa(buffer.readInteger());
		smlTupelEntry.setUnitR2(buffer.readUnsigned());
		smlTupelEntry.setScalerR2(buffer.readInteger());
		smlTupelEntry.setValueR2(buffer.readInteger());
		smlTupelEntry.setUnitR3(buffer.readUnsigned());
		smlTupelEntry.setScalerR3(buffer.readInteger());
		smlTupelEntry.setValueR3(buffer.readInteger());
		smlTupelEntry.setSignature_mA_R2_R3(buffer.readOctetString());

		return smlTupelEntry;
	} else {
		throw new Error("Unknown TL-Field for SmlTupelEntry!");
	}
};

module.exports = SmlTupelEntry;
