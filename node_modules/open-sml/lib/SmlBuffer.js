/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('./Constants');

function SmlBuffer(value){

	if(value===undefined) {
		this.buffer = Buffer.alloc(Constants.MAX_BUFFER_SIZE);
	} else {
		this.buffer=value;
	}
	this.offset=0;
    this.lastReadValueType=null;
}

SmlBuffer.prototype.getBuffer = function getBuffer(){
	return this.buffer;
};

SmlBuffer.prototype.getOffset = function getOffset(){
	return this.offset;
};

SmlBuffer.prototype.setOffset = function setOffset(value){
	this.offset = value;
};

SmlBuffer.prototype.getLength = function getLength(){
	return this.buffer.length;
};

SmlBuffer.prototype.toString = function toString(){
	if (!Buffer.isBuffer(this.buffer)) return this.buffer;
	return this.buffer.toString('hex');
};

SmlBuffer.prototype.finalize = function finalize(startOffset){
    if (!startOffset) startOffset=0;
    this.buffer=this.buffer.slice(startOffset, this.offset);
};


// ########################## OctetString #########################################################

SmlBuffer.prototype.writeOctetString = function writeOctetString(value){
	/*var bits = Math.ceil(Math.log(value.length)/Math.log(2));
	var bytes = Math.ceil(bits/4);
	var hexLength = (value.length+bytes).toString(16).length % 2 === 0 ? (value.length+bytes).toString(16) : "0"+(value.length+bytes).toString(16);
	var length = new Buffer(hexLength, 'hex');


	for(var i=0; i<bytes; i++){
		if(bytes-(i+1) > 0){
			byte = 0x80 | ((length.readUInt8(Math.floor(i/2)) & 0xF0)>>4);
		} else {
			byte = 0x00 | (length.readUInt8(Math.floor(i/2)) & 0x0F);
		}
		this.buffer.writeUInt8(byte, this.offset);
		this.offset+=1;
	}*/
    this.writeTLField(0x0, value.length); // SEQUENZ

    if (Buffer.isBuffer(value)) {
        value.copy(this.buffer, this.offset);
        this.offset+=value.length;
    }
    else {
        for(var j=0; j<value.length; j++){
    		this.buffer.writeUInt8(value.charCodeAt(j), this.offset);
    		this.offset++;
    	}
    }
};

SmlBuffer.prototype.readOctetString = function readOctetString(){
	var tlField = this.readTLField();

	var type = tlField.type;
	var length = tlField.length;

	// OPTIONAL
	if(type === 0x00 && length===0x01){
		return undefined;
	} else {
		if(type !== 0x08 && type !== 0x00){
			throw new Error("Unknown TL-Field 0x"+tlField.type.toString(16)+tlField.length.toString(16)+" for OctetString [Offset: "+this.offset+"]!");
		} else {
            this.lastReadValueType=type;
            var result = this.buffer.slice(this.offset, this.offset+tlField.length-1);
			this.offset+=tlField.length-1;
			return result;
		}
	}
};

// ############################ read #############################################

SmlBuffer.prototype.readUInt8 = function readUInt8(){
	var result = this.buffer.readUInt8(this.offset);
	this.offset++;
    this.lastReadValueType = Constants.UINT8;
	return result;
};

SmlBuffer.prototype.readInt8 = function readInt8(){
	var result = this.buffer.readInt8(this.offset);
	this.offset++;
    this.lastReadValueType = Constants.INT8;
	return result;
};

SmlBuffer.prototype.readUInt16 = function readUInt16(){
	var result = this.buffer.readUInt16BE(this.offset);
	this.offset+=2;
    this.lastReadValueType = Constants.UINT16;
	return result;
};

SmlBuffer.prototype.readInt16 = function readInt16(){
	var result = this.buffer.readInt16BE(this.offset);
	this.offset+=2;
    this.lastReadValueType = Constants.INT16;
	return result;
};

SmlBuffer.prototype.readUInt32 = function readUInt32(){
	var result = this.buffer.readUInt32BE(this.offset);
	this.offset+=4;
    this.lastReadValueType = Constants.UINT32;
	return result;
};

SmlBuffer.prototype.readInt32 = function readInt32(){
	var result = this.buffer.readInt32BE(this.offset);
	this.offset+=4;
    this.lastReadValueType = Constants.INT32;
	return result;
};

SmlBuffer.prototype.readUInt64 = function readUInt64(){
	//var result = (this.buffer.readUInt32BE(this.offset+4)<<8) & this.buffer.readUIntBE(this.offset);
	/*var result = this.buffer.readDoubleBE(this.offset);
	this.offset+=8;
    this.lastReadValueType = Constants.UINT64;
	return result;*/
    var Int64 = require('int64-buffer');
    var int64 = new Int64.Uint64BE(this.buffer, this.offset);
    this.offset+=8;
    this.lastReadValueType = Constants.UINT64;
    if (int64.toNumber().toString(10)==int64.toString(10)) {
        return int64.toNumber();
    }
    else {
        return int64.toString(10);
    }
};

SmlBuffer.prototype.readInt64 = function readInt64(){
	var Int64 = require('int64-buffer');
	var int64 = new Int64.Int64BE(this.buffer, this.offset);
	this.offset+=8;
    this.lastReadValueType = Constants.INT64;
    if (int64.toNumber().toString(10)==int64.toString(10)) {
        return int64.toNumber();
    }
    else {
        return int64.toString(10);
    }
};


// ################################ write ########################################

SmlBuffer.prototype.writeInt8 = function writeInt8(value){
	this.buffer.writeInt8(value, this.offset);
	this.offset+=1;
};

SmlBuffer.prototype.writeUInt8 = function writeUInt8(value){
	this.buffer.writeUInt8(value, this.offset);
	this.offset+=1;
};

SmlBuffer.prototype.writeInt16 = function writeInt16(value){
	this.buffer.writeInt16BE(value, this.offset);
	this.offset+=2;
};

SmlBuffer.prototype.writeUInt16 = function writeUInt16(value){
	this.buffer.writeUInt16BE(value, this.offset);
	this.offset+=2;
};

SmlBuffer.prototype.writeInt32 = function writeInt32(value){
	this.buffer.writeInt32BE(value, this.offset);
	this.offset+=4;
};

SmlBuffer.prototype.writeUInt32 = function writeUInt32(value){
	this.buffer.writeUInt32BE(value, this.offset);
	this.offset+=4;
};

SmlBuffer.prototype.writeInt64 = function writeInt64(value){
	//this.buffer.writeDoubleBE(value, this.offset);
    var Int64 = require('int64-buffer');
    if (typeof value == "string") int64 = new Int64.Int64BE(value,10);
      else int64 = new Int64.Int64BE(value);
    int64.toBuffer().copy(this.buffer,this.offset);
	this.offset+=8;
};

SmlBuffer.prototype.writeUInt64 = function writeUInt64(value){
	//this.buffer.writeDoubleBE(value, this.offset);
    var Int64 = require('int64-buffer');
    var int64;
    if (typeof value == "string") int64 = new Int64.Uint64BE(value,10);
      else int64 = new Int64.Uint64BE(value);
    int64.toBuffer().copy(this.buffer,this.offset);
	this.offset+=8;
};

// #########################################################################

SmlBuffer.prototype.readTLField = function readTLField(){
	var length = 0;
	var counter = 0;
    var type;
    var readMore = false;
    do {
        var tlField = this.buffer.readUInt8(this.offset);
		this.offset++;

        readMore = (tlField >> 7 === 1) ? true : false;
        if (type === undefined) {
			type = ((tlField & 0x7F) >> 4);
		}
		length = ((length<<4) + (tlField & 0x0F));
        if ((tlField & 0x7F) >> 4 === 0 && readMore) { // We have an OctetString and want to return "left length" instead of full length
            counter++;
        }
	} while (readMore);

    length-=counter;
	return {type: type, length: length};
};

// ToDo: Multibyte tl fields
SmlBuffer.prototype.writeTLField = function writeTLField(value, length){
    if (! length) {
        // we directly write out the value because not allowed to be bigger then 1 bytes
        if (value > 0xFF) {
            throw new Error("writeTLField without length only allowed for 1 byte values");
        }
        this.buffer.writeUInt8(value, this.offset);
    	this.offset++;
    }
    else {
        if (value > 0x7) {
            throw new Error("writeTLField with type >0x7 is not allowed");
        }
        // value if the "type" and length is the length
        var bytes = Math.ceil(Math.log(length)/Math.log(2) / 4);
		if (value === 0x0) {
		    length += bytes;
        }

		var lengthVals = [];
        do {
            lengthVals.push(length - ((length >> 4) << 4));
            length = length >> 4;
        } while (length > 0);

        var baseValue = value << 4;
        while (lengthVals.length) {
            var currentLength = lengthVals.pop();
            var writeValue = 0;
            if (lengthVals.length) writeValue = 0x80; // set highest bit because length still > 15
            writeValue = writeValue | baseValue | currentLength;
            this.buffer.writeUInt8(writeValue, this.offset);
        	this.offset++;
            baseValue = 0;
        }
    }
};


SmlBuffer.prototype.readUnsigned = function readUnsigned(){
	var tlField = this.readTLField();
	var type = tlField.type;
	var length = tlField.length;

	// Optional
	if(type===0x00 && length === 0x01){
        this.lastReadValueType = Constants.OPTIONAL;
        return undefined;
	} else {
		if(type!=Constants.UNSIGNED && type!==0x00){
			throw new Error("Wrong TL-Field (" + type.toString(16) + ") for Unsigned!");
		} else {
			if(length == 0x02){
                this.lastReadValueType = Constants.UINT8;
				return this.readUInt8();
			} else if(length == 0x03){
                this.lastReadValueType = Constants.UINT16;
				return this.readUInt16();
			} else if(length == 0x04){
				// Just for EMH impelementation and short Timestamps because of misconfigured/unreachable NTP Server
                this.lastReadValueType = Constants.UINT32;
                var result = this.buffer.readUIntBE(this.offset,3);
                this.offset+=3;
                return result;
			} else if(length == 0x05){
                this.lastReadValueType = Constants.UINT32;
				return this.readUInt32();
			} else if(length == 0x09){
                this.lastReadValueType = Constants.UINT64;
				return this.readUInt64();
			}
		}
	}
};

SmlBuffer.prototype.writeUnsigned = function writeUnsigned(value, tlField){
	if(tlField==Constants.UINT8){
		this.writeTLField(Constants.UINT8);
		this.writeUInt8(value);
	} else if(tlField==Constants.UINT16){
		this.writeTLField(Constants.UINT16);
		this.writeUInt16(value);
	} else if(tlField==Constants.UINT32){
		this.writeTLField(Constants.UINT32);
		this.writeUInt32(value);
	} else if(tlField==Constants.UINT64){
		this.writeTLField(Constants.UINT64);
		this.writeUInt64(value);
	} else if (valueType==Constants.OPTIONAL){
        this.writeUInt8(0x01);
    }
};

SmlBuffer.prototype.readInteger = function readInteger(){
	var tlField = this.readTLField();
	var type = tlField.type;
	var length = tlField.length;

	if(type===0x00 && length === 0x01){
		return undefined;
	} else {
		if(type != Constants.INTEGER && type !== 0x00){
			throw new Error("Wrong TL-Field for Integer!");
		} else {
			if(length == 0x02){
                this.lastReadValueType = Constants.INT8;
				return this.readInt8();
			} else if(length == 0x03){
                this.lastReadValueType = Constants.INT16;
				return this.readInt16();
            } else if(length == 0x04){
                this.lastReadValueType = Constants.INT32;
                var result = this.buffer.readIntBE(this.offset,3);
                this.offset+=3;
                return result;
			} else if(length == 0x05){
                this.lastReadValueType = Constants.INT32;
				return this.readInt32();
            } else if(length == 0x06){
                this.lastReadValueType = Constants.INT64;
				var result = this.buffer.readIntBE(this.offset,5);
                this.offset+=5;
                return result;
			} else if(length == 0x09){
                this.lastReadValueType = Constants.INT64;
				return this.readInt64();
			}
		}
	}
};

SmlBuffer.prototype.writeInteger = function writeInteger(value, tlField){
	if(tlField==Constants.INT8){
		this.writeTLField(Constants.INT8);
		this.writeInt8(value);
	} else if(tlField==Constants.INT16){
		this.writeTLField(Constants.INT16);
		this.writeInt16(value);
	} else if(tlField==Constants.INT32){
		this.writeTLField(Constants.INT32);
		this.writeInt32(value);
	} else if(tlField==Constants.INT64){
		this.writeTLField(Constants.INT64);
		this.writeInt64(value);
	} else if (valueType==Constants.OPTIONAL){
        this.writeUInt8(0x01);
    }
};

SmlBuffer.prototype.readSmlValue = function readSmlValue(){

	if((this.buffer.readUInt8(this.offset)>>4)===0x00 || (this.buffer.readUInt8(this.offset)>>4)===0x08){
		return this.readOctetString();
	} else if((this.buffer.readUInt8(this.offset)>>4)==0x04){
		return this.readSmlBoolean();
	} else if((this.buffer.readUInt8(this.offset)>>4)==0x05){
		return this.readInteger();
	} else if((this.buffer.readUInt8(this.offset)>>4)==0x06){
		return this.readUnsigned();
	} else {
		throw new Error("Wrong TL-Field 0x"+this.buffer.readUInt8(this.offset).toString(16)+" for SmlValue!");
	}
};

SmlBuffer.prototype.writeSmlValue = function writeSmlValue(value, valueType){
	if(valueType==Constants.BOOLEAN){
		this.writeSmlBoolean(value);
	} else if(valueType==Constants.OCTET_STRING){
		this.writeOctetString(value);
	} else if(valueType==Constants.UINT8){
		this.writeUnsigned(value, valueType);
	} else if(valueType==Constants.UINT16){
		this.writeUnsigned(value, valueType);
	} else if(valueType==Constants.UINT32){
		this.writeUnsigned(value, valueType);
	} else if(valueType==Constants.UINT64){
		this.writeUnsigned(value, valueType);
	} else if(valueType==Constants.INT8){
		this.writeInteger(value, valueType);
	} else if(valueType==Constants.INT16){
		this.writeInteger(value, valueType);
	} else if(valueType==Constants.INT32){
		this.writeInteger(value, valueType);
	} else if(valueType==Constants.INT64){
		this.writeInteger(value, valueType);
	} else if (valueType==Constants.OPTIONAL){
        this.writeUInt8(0x01);
    }
};

SmlBuffer.prototype.readSmlBoolean = function readSmlBoolean(){
	var tlField = this.readTLField();
	var type = tlField.type;
	var length = tlField.length;

	if(type === 0x00 && length === 0x01){
		// OPTIONAL
		return undefined;
	} else {
		if(type != Constants.BOOLEAN || length != 0x02){
			throw new Error("Wrong TL-Field for Boolean!");
		} else {
			if(this.readUInt8()===0x00){
                this.lastReadValueType = Constants.BOOLEAN;
				return false;
			} else {
                this.lastReadValueType = Constants.BOOLEAN;
				return true;
			}
		}
	}
};

SmlBuffer.prototype.writeSmlBoolean = function writeSmlBoolean(value){

	if(value === undefined){
		// Optional
		this.writeUInt8(Constants.OPTIONAL);
	} else {
		this.writeTLField(0x42);
		if(value === true){
			this.writeUInt8(0x01);
		} else {
			this.writeUInt8(0x00);
		}
	}
};

SmlBuffer.prototype.readChoice = function readChoice(){
	var tlField = this.readTLField();

	var type = tlField.type;
	var length = tlField.length;

	if (type === 0x00 && length === 0x01) {
		// OPTIONAL
		return undefined;
	} else if (tlField.type == 0x06 && tlField.length == 0x05) {
		// workaround Holley DTZ541
		// if SML_ListEntry valTime (SML_Time) is given there are missing bytes:
		// 0x72: indicate a list for SML_Time with 2 entries
		// 0x62 0x01: indicate secIndex
		// 0x65 + 4 bytes seconds
		// instead, the DTZ541 starts with the last line: 0x65 + 4 bytes secIndex
		//
		// reset the previously read tl-field to be able
		// to re-read the TLField 0x65 to get the secIndex value
		this.setOffset(this.offset - 1);
		// this workaround will return choice 0x01 and sets the offset back to
		return 0x01;
	} else if (tlField.type != 0x07 && tlField.length != 0x02) {
		throw new Error("Wrong TL-Field 0x" + type.toString(16) + length.toString(16) + " for Choice!");
	} else {
		return this.readUnsigned();
	}
};

SmlBuffer.prototype.writeChoice = function writeChoice(value, tlField){
	this.writeTLField(0x72);
	if([Constants.UINT8, Constants.UINT16, Constants.UINT32, Constants.UINT64].indexOf(tlField) > -1){
		this.writeUnsigned(value, tlField);
	} else {
		throw new Error("Unknown Choice-Element!");
	}
};

module.exports = SmlBuffer;
