/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlValueListEntry = require('./SmlValueListEntry');
var Constants = require('../../Constants');

function SmlValueList(){
	this.listEntries = [];
}

SmlValueList.prototype.getSize = function getSize(){
	var size = 1;
	for(var listEntry in this.listEntries){
		size += this.listEntries[listEntry].getSize();
	}
	return size;
};

SmlValueList.prototype.write = function write(buffer){
	buffer.writeTLField(0x7, this.listEntries.length); // SEQUENZ
	for(var listEntries in this.listEntries){
		this.listEntries[listEntrie].write(buffer);
	}
};

SmlValueList.prototype.addListEntry = function addListEntry(value){
	this.listEntries[this.listEntries.length]=value;
};

SmlValueList.prototype.getListEntries = function getListEntries(){
	return this.listEntries;
};

SmlValueList.prototype.getListEntryAt = function getListEntryAt(id){
	return this.listEntries[id];
};

SmlValueList.prototype.getLength = function getLength(){
	return this.listEntries.length;
};

SmlValueList.prototype.toString = function toString(){
	var str = "[\n";
	for(var listEntry in this.listEntries){
		str += this.listEntries[listEntry].toString()+", \n";
	}

	str+="]";
	return str;
};

SmlValueList.parse = function parse(buffer){

	var smlValueList = new SmlValueList();
	var tlField = buffer.readTLField();

	if(tlField.type!=0x07){
		throw new Error("Unknown TL-Field for SmlValueList!");
	}

	for(var i=0; i<tlField.length; i++){
		smlValueList.addListEntry(SmlValueListEntry.parse(buffer));
	}

	return smlValueList;

};

module.exports = SmlValueList;
