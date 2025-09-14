var VirtualSerialPort = require('../');

var sp = new VirtualSerialPort('/dev/null', {
    autoOpen: false
});

// Simple echo function for fake Arduino
sp.on('dataToDevice', function(data) {
    console.log('Arduino: ' + (data == 1 ? 'BLEEP' : 'BLOOP'));
    sp.writeToComputer(data ^ 1);
});

sp.on('close', function() {
    console.log('Got close event');
});

sp.on('open', function() {
    console.log('Initialized virtual serial port!');

    var i = 3;
    var t = setInterval(function() {
        sp.write(Math.floor(Math.random() * 2));

        if (--i === 0) {
            sp.close();
            clearInterval(t);
        }
    }, 1000);

    sp.on('data', function(data) {
        console.log('Computer: ' + (data == 1 ? 'BLEEP' : 'BLOOP'));
    });
});

sp.on('error', function(err) {
    if(err.message === 'Port is already open') {
      console.log('Got expected error')
    }
});

sp.open(function() {
    console.log('Open callback!');
});

sp.open(function() {
    console.log('Open callback #2 - should\'ve never been called!');
});
