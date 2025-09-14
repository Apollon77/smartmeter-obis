/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlProfObjHeaderListEntry = require('./SmlProfObjHeaderListEntry');

function SmlProfObjHeaderList(){
	this.listEntries = [];
}

SmlProfObjHeaderList.prototype.getSize = function getSize(){
	var size = 1;
	for(var listEntry in this.listEntries){
		size += this.listEntries[listEntry].getSize();
	}
	return size;
};

SmlProfObjHeaderList.prototype.write = function write(buffer){
	buffer.writeTLField(0x7, this.listEntries.length); // SEQUENZ
	for(var listEntries in this.listEntries){
		this.listEntries[listEntrie].write(buffer);
	}
};

SmlProfObjHeaderList.prototype.addListEntry = function addListEntry(value){
	this.listEntries[this.listEntries.length]=value;
};

SmlProfObjHeaderList.prototype.getListEntries = function getListEntries(){
	return this.listEntries;
};

SmlProfObjHeaderList.prototype.getListEntryAt = function getListEntryAt(id){
	return this.listEntries[id];
};

SmlProfObjHeaderList.prototype.getLength = function getLength(){
	return this.listEntries.length;
};

SmlProfObjHeaderList.prototype.toString = function toString(){
	var str = "[\n";
	for(var listEntry in this.listEntries){
		str += this.listEntries[listEntry].toString()+", \n";
	}

	str+="]";
	return str;
};

SmlProfObjHeaderList.parse = function parse(buffer){

	var smlProfObjHeaderList = new SmlProfObjHeaderList();
	var tlField = buffer.readTLField();

	if(tlField.type!=0x07){
		throw new Error("Unknown TL-Field for SmlProfObjHeaderList!");
	}

	for(var i=0; i<tlField.length; i++){
		smlProfObjHeaderList.addListEntry(SmlProfObjHeaderListEntry.parse(buffer));
	}

	return smlProfObjHeaderList;

};

module.exports = SmlProfObjHeaderList;
