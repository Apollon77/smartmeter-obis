/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlProfObjPeriodListEntry = require('./SmlProfObjPeriodListEntry');

function SmlProfObjPeriodList(){
	this.listEntries = [];
}

SmlProfObjPeriodList.prototype.getSize = function getSize(){
	var size = 1;
	for(var listEntry in this.listEntries){
		size += this.listEntries[listEntry].getSize();
	}
	return size;
};

SmlProfObjPeriodList.prototype.write = function write(buffer){
	buffer.writeTLField(0x7, this.listEntries.length); // SEQUENZ
	for(var listEntries in this.listEntries){
		this.listEntries[listEntrie].write(buffer);
	}
};

SmlProfObjPeriodList.prototype.addListEntry = function addListEntry(value){
	this.listEntries[this.listEntries.length]=value;
};

SmlProfObjPeriodList.prototype.getListEntries = function getListEntries(){
	return this.listEntries;
};

SmlProfObjPeriodList.prototype.getListEntryAt = function getListEntryAt(id){
	return this.listEntries[id];
};

SmlProfObjPeriodList.prototype.getLength = function getLength(){
	return this.listEntries.length;
};

SmlProfObjPeriodList.prototype.toString = function toString(){
	var str = "[\n";
	for(var listEntry in this.listEntries){
		str += this.listEntries[listEntry].toString()+", \n";
	}

	str+="]";
	return str;
};

SmlProfObjPeriodList.parse = function parse(buffer){

	var smlProfObjPeriodList = new SmlProfObjPeriodList();
	var tlField = buffer.readTLField();

	if(tlField.type!=0x07){
		throw new Error("Unknown TL-Field for SmlProfObjPeriodList!");
	}

	for(var i=0; i<tlField.length; i++){
		smlProfObjPeriodList.addListEntry(SmlProfObjPeriodListEntry.parse(buffer));
	}

	return smlProfObjPeriodList;

};

module.exports = SmlProfObjPeriodList;
