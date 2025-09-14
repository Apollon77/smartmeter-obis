/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlPeriodListEntry = require('./SmlPeriodListEntry');
var SmlTupelEntry = require('./SmlTupelEntry');
var SmlTime = require('./SmlTime');
var SmlTreeList = require('./SmlTreeList');
var Constants = require('../../Constants');

function SmlTree(){
	this.parameterName = undefined;
	this.parameterValue = undefined;
	this.parameterValueType = undefined;
	this.childList = undefined;
}

SmlTree.prototype.getParameterName = function getParameterName(){
	return this.parameterName;
};

SmlTree.prototype.setParameterName = function setParameterName(value){
	this.parameterName = value;
};

SmlTree.prototype.getParameterValue = function getParameterValue(){
	return this.parameterValue;
};

SmlTree.prototype.setParameterValue = function setParameterValue(value){
	this.parameterValue = value;
};

SmlTree.prototype.setParameterValueType = function setParameterValueType(value){
	this.parameterValueType = value;
};

SmlTree.prototype.getParameterValueType = function getParameterValueType(){
	return this.parameterValueType;
};

SmlTree.prototype.getChildList = function getChildList(){
	return this.childList;
};

SmlTree.prototype.setChildList = function setChildList(value){
	this.childList = value;
};

SmlTree.prototype.getSize = function getSize(){
	var size = 2;
	size += this.parameterName.length;

	if(this.parameterValue !== undefined){
		size += 2;
		if(this.parameterValueType == 0x01){

		} else {
			size += this.parameterValue.getSize();
		}
	} else {
		size += 1;
	}
	if(this.childList !== undefined){
		size += this.childList.getSize();
	} else {
		size += 1;
	}

	return size;
};

SmlTree.prototype.write = function write(buffer){
	buffer.writeTLField(0x73); // SEQUENZ
	buffer.writeOctetString(this.parameterName);

	if(this.parameterValue !== undefined){
		buffer.writeChoice(this.parameterValueType, Constants.UINT8);
	} else {
		buffer.writeUInt8(0x01);
	}

	if(this.childList !== undefined){
		this.childList.write(buffer);
	} else {
		buffer.writeUInt8(0x01);
	}
};

SmlTree.prototype.toString = function toString(){
	var str = "";
	str += "\t\t\t\tParameter-Name: "+(this.parameterName?this.parameterName.toString('hex'):this.parameterName)+"\n";
	if(this.parameterValue!==undefined){
		str += "\t\t\t\tParameter-Value: "+this.parameterValue.toString()+"\n";
	}
	if(this.childList!==undefined){
		str += "\t\t\t\tChild-List: "+this.childList.toString()+"\n";
	}
	return str;
};

SmlTree.parse = function parse(buffer){
	var tlField =  buffer.readTLField();
	if(tlField.type==0x07 && tlField.length==0x03){
		var smlTree = new SmlTree();
		smlTree.setParameterName(buffer.readOctetString());

		var choice = buffer.readChoice();
		// OPTIONAL
		if(choice === undefined){
			smlTree.setParameterValue(undefined);
            smlTree.setParameterValueType(0x01);
		} else {
			if(choice==0x01){
				smlTree.setParameterValue(buffer.readSmlValue());
			} else if(choice==0x02){
				smlTree.setParameterValue(SmlPeriodListEntry.parse(buffer));
			} else if(choice==0x03){
				smlTree.setParameterValue(SmlTupelEntry.parse(buffer));
			} else if(choice==0x04){
				smlTree.setParameterValue(SmlTime.parse(buffer));
			}
            smlTree.setParameterValueType(choice);
		}

		smlTree.setChildList(SmlTreeList.parse(buffer));
		return smlTree;
	} else {
		throw new Error("Unknown TL-Field for SmlTree!");
	}
};

module.exports = SmlTree;
