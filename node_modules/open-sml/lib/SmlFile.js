/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var SmlBuffer = require('./SmlBuffer');
var Constants = require('./Constants');
var SmlMessage = require('./SmlMessage');
var Crc16 = require("./SmlCRC");

function SmlFile(){
	this.messages = [];
    this.valid=undefined;
}

SmlFile.prototype.write = function write(){
	var buffer = new SmlBuffer(Buffer.alloc(this.getSize()));
	buffer.writeUInt32(0x1b1b1b1b);
	buffer.writeUInt32(0x01010101);
    var lastMessageTag=null;
    for(var msg in this.messages){
		this.messages[msg].write(buffer);
        lastMessageTag=this.messages[msg].getMessageTag();
	}
    if(lastMessageTag == Constants.PUBLIC_CLOSE_RESPONSE || lastMessageTag == Constants.PUBLIC_CLOSE_REQUEST){
        var counterAddedBytes=0;
        while (buffer.offset%4!==0) {
            buffer.writeUInt8(0);
            counterAddedBytes++;
        }
        buffer.writeUInt32(0x1b1b1b1b);
        buffer.writeUInt8(0x1a);
        buffer.writeUInt8(counterAddedBytes);

        //console.log("CALC FOR");
        //console.log(buffer.buffer.slice(0, buffer.offset).toString('hex'));
        var crc=Crc16.crc16CCITT(buffer.buffer.slice(0, buffer.offset));
        //console.log("Calculated write CRC16="+crc.toString(16));
        buffer.writeUInt16(crc);
        buffer.finalize();
    }
    else {
        buffer.finalize(8);
    }

	return buffer;
};

SmlFile.prototype.getSize = function getSize(){
	var size = 8;
	for(var msg in this.messages){
		size += this.messages[msg].getSize();
	}
    size += 4-(size%4) + 4 + 1 + 3; // Filler to end up dividable by 4, end sequence (4), end of message (1), checksum (2+1)
    //console.log("SmlFile. size: "+size);
	return size;
};

SmlFile.prototype.addMessage = function addMessage(smlMessage){
	this.messages.push(smlMessage);
};

SmlFile.prototype.getMessages = function getMessages(){
	return this.messages;
};

SmlFile.prototype.toString = function toString(){
	var str = "START SML-File\n";

	for(var msg in this.messages){
		var message = this.messages[msg];
		if (typeof message.toString === "function") {
			str += message.toString() + "\n";
		}
		else {
			str += message + "\n";
		}
	}
	str += "END SML-File\n";
	return str;
};

SmlFile.prototype.parse = function parse(buffer){
	var smlBuffer = new SmlBuffer(buffer);

	if(buffer.readUInt32BE(0)==0x1b1b1b1b){
		smlBuffer.setOffset(4);
	}

	if(buffer.readUInt32BE(4)==0x01010101){
		smlBuffer.setOffset(8);
	} else if(buffer.readUInt32BE(4)==0x02020202){
		smlBuffer.setOffset(8);
	}

	do{
		var message = SmlMessage.parse(smlBuffer);
		this.addMessage(message);
		smlBuffer.readUInt8(); // EndOfSMLMessage
		if(message.getMessageTag() == Constants.PUBLIC_CLOSE_RESPONSE || message.getMessageTag() == Constants.PUBLIC_CLOSE_REQUEST){
            var counterAddedBytes=0;
            while (buffer.offset%4!==0 || buffer.length-smlBuffer.offset>8) {
                smlBuffer.readUInt8(0);
                counterAddedBytes++;
            }
            //console.log("read "+counterAddedBytes+" added bytes. Offset now="+smlBuffer.offset+" from "+buffer.length);

			if(smlBuffer.getOffset() < buffer.length && smlBuffer.readUInt32() == 0x1b1b1b1b){
				if(smlBuffer.readUInt8() == 0x1a){
                    var addedBytes=smlBuffer.readUInt8();
                    if (counterAddedBytes!=addedBytes) {
                        //console.log("Added bytes do not match: awaited="+addedBytes+" read="+counterAddedBytes);
                    }
                    var crcRead=smlBuffer.readUInt16();
                    var crcCalc=Crc16.crc16CCITT(buffer.slice(0, smlBuffer.offset-2));
                    //console.log("CRC16-Compare Msg="+crcRead.toString(16)+", Calculated="+crcCalc.toString(16));
                    if (crcRead == crcCalc){
						this.valid = true;
					}
                    else {
                        crcCalc=Crc16.crc16CCITTRotate(buffer.slice(0, smlBuffer.offset-2));
                        //console.log("CRC16-Compare-Rotated Msg="+crcRead.toString(16)+", Calculated="+crcCalc.toString(16));
                        if (crcRead == crcCalc){
    						this.valid = true;
    					} else {
                            // Workaround for Holley DTZ541 uses CRC-16/Kermit
                            crcCalc = Crc16.crc16Kermit(buffer.slice(0, smlBuffer.offset - 2));
                            this.valid = crcRead === crcCalc;
                        }
                    }
				}
			}
			//console.log('CRC16-Check: '+this.valid);

		}
	} while(smlBuffer.getOffset() < buffer.length-12);
};

module.exports = SmlFile;
