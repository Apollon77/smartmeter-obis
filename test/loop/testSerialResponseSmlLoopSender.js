// open up socat:
// sudo socat -d -d pty,link=/Volumes/Dev/serial-master,raw,echo=0,user=ingof,group=staff pty,link=/Volumes/Dev/serial-slave,raw,echo=0,user=ingof,group=staff

var SerialPort = require('serialport');

var masterSerial = new SerialPort('/Volumes/Dev/serial-master', {
    autoOpen: true,
    baudrate:   9600
});

var testData = Buffer.from('1b1b1b1b01010101760700190b4cbead6200620072630101760101070019063f3f8f0b0901454d48000041f045010163662d00760700190b4cbeae620062007263070177010b0901454d48000041f045070100620affff72620165063f2f357777078181c78203ff0101010104454d480177070100000009ff010101010b0901454d48000041f0450177070100010800ff6400018201621e52ff560009247a550177070100010801ff0101621e52ff560009247a550177070100010802ff0101621e52ff5600000000000177070100100700ff0101621b52ff55000016030177078181c78205ff0172620165063f2f3501018302e77ef33ea97bb6bba9bfa4fbd8b9f2ede51207b15acf6b98a237c21ca4982ee3ce18efe8438f1deba9d5c40eb68ae8f201010163574a00760700190b4cbeb16200620072630201710163d658000000001b1b1b1b1a03e566', 'hex');

function sendData() {
    var data_offset = 0;

    var sendInterval = setInterval(function() {
        if (data_offset === testData.length) {
            clearInterval(sendInterval);
            setTimeout(sendData, 2000);
            console.log('.');
        }
        else {
            masterSerial.write(testData.slice(data_offset,data_offset=(data_offset+5>=testData.length)?testData.length:data_offset+5));
        }
    }, 1);
}

masterSerial.on('open', function() {
    sendData();
});
