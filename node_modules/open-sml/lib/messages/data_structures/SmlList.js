/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlListEntry = require('./SmlListEntry');

function SmlList(){
	this.listEntries = [];
}

SmlList.prototype.getSize = function getSize(){
	var size = 1;
	for(var listEntry in this.listEntries){
		size += this.listEntries[listEntry].getSize();
	}
	return size;
};

SmlList.prototype.addListEntry = function addListEntry(value){
	this.listEntries[this.listEntries.length]=value;
};

SmlList.prototype.getListEntries = function getListEntries(){
	return this.listEntries;
};

SmlList.prototype.getListEntryAt = function getListEntryAt(id){
	return this.listEntries[id];
};

SmlList.prototype.getLength = function getLength(){
	return this.listEntries.length;
};

SmlList.prototype.write = function write(buffer){
	buffer.writeTLField(0x7,this.listEntries.length); // SEQUENZ
	for(var listEntry in this.listEntries){
		this.listEntries[listEntry].write(buffer);
	}
};

SmlList.prototype.toString = function toString(){
	var str = "[\n";
	for(var listEntry in this.listEntries){
		str += this.listEntries[listEntry].toString()+", \n";
	}

	str+="]";
	return str;
};

SmlList.parse = function parse(buffer){

	var smlList = new SmlList();
	var tlField = buffer.readTLField();

	if(tlField.type!=0x07){
		throw new Error("Unknown TL-Field for SmlList!");
	}

	for(var i=0; i<tlField.length; i++){
		smlList.addListEntry(SmlListEntry.parse(buffer));
	}
    // There are some devices that contain a wrong number of records (they send more, so check and try)
    while (buffer.buffer.readUInt8(buffer.offset) === 0x77) {
        var currentOffset = buffer.offset;
        try {
            smlList.addListEntry(SmlListEntry.parse(buffer));
        }
        catch (err) {
            // ok we may have not had an additional ListEntry, so reset Offset and go further normally
            buffer.offset = currentOffset;
            break;
        }
    }

	return smlList;
};

module.exports = SmlList;
