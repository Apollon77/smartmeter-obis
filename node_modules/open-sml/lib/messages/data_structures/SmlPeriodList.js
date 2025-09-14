/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlPeriodListEntry = require('./SmlPeriodListEntry');
var Constants = require('../../Constants');

function SmlPeriodList(){
	this.periodListEntries = [];
}

SmlPeriodList.prototype.addListEntry = function addListEntry(value){
	this.periodListEntries[this.periodListEntries.length]=value;
};

SmlPeriodList.prototype.getListEntries = function getListEntries(){
	return this.periodListEntries;
};

SmlPeriodList.prototype.getListEntryAt = function getListEntryAt(id){
	return this.periodListEntries[id];
};

SmlPeriodList.prototype.getLength = function getLength(){
	return this.periodListEntries.length;
};

SmlPeriodList.prototype.getSize = function getSize(){
	var size = 1;
	for(var periodListEntry in this.periodListEntries){
		size += this.periodListEntries[periodListEntry].getSize();
	}
	return size;
};

SmlPeriodList.prototype.write = function write(buffer){
	buffer.writeTLField(0x7, this.periodListEntries.length); // SEQUENZ
	for(var periodListEntry in this.periodListEntries){
		this.periodListEntries[periodListEntry].write(buffer);
	}
};

SmlPeriodList.prototype.toString = function toString(){
	var str = "[\n";
	for(var periodListEntry in this.periodListEntries){
		str += this.periodListEntries[periodListEntry].toString()+", \n";
	}

	str+="\t\t\t]";
	return str;
};

SmlPeriodList.parse = function parse(buffer){

	var smlPeriodList = new SmlPeriodList();
	var tlField = buffer.readTLField();

	if(tlField.type!=0x07){
		throw new Error("Unknown TL-Field for SmlPeriodList!");
	}

	for(var i=0; i<tlField.length; i++){
		smlPeriodList.addListEntry(SmlPeriodListEntry.parse(buffer));
	}

	return smlPeriodList;

};

module.exports = SmlPeriodList;
