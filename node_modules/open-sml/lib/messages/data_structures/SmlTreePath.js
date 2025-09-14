/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('../../Constants');

function SmlTreePath(){
	this.pathEntries=[];
}

SmlTreePath.prototype.addPathEntry = function addPathEntry(pathEntry){
	this.pathEntries.push(pathEntry);
};

SmlTreePath.prototype.getPathEntries = function getPathEntries(){
	return this.pathEntries;
};

SmlTreePath.prototype.toString = function toString(){
	var str = "[";
	for(var pathEntry in this.pathEntries){
		str += this.pathEntries[pathEntry].toString('hex')+", ";
	}
	str +="]";
	return str;
};

SmlTreePath.prototype.getSize = function getSize(){
	var size = 1;
	for(var pathEntry in this.pathEntries){
		size += 1+this.pathEntries[pathEntry].length;
	}
	return size;
};

SmlTreePath.prototype.write = function write(buffer){
	buffer.writeTLField(0x7, this.pathEntries.length); // SEQUENZ
	for(var pathEntry in this.pathEntries){
		buffer.writeOctetString(this.pathEntries[pathEntry]);
	}
};

SmlTreePath.parse = function parse(buffer){
	var smlTreePath = new SmlTreePath();
	var tlField = buffer.readTLField();

	if(tlField.type!=0x07){
		throw new Error("Unknown TL-Field for SmlTreePath!");
	}

	for(var i=0; i<tlField.length; i++){
		smlTreePath.pathEntries[i]=buffer.readOctetString();
	}

	return smlTreePath;
};

module.exports = SmlTreePath;
