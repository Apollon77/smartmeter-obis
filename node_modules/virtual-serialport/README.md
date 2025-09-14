# virtual-serialport

Do you use [node-serialport](https://github.com/voodootikigod/node-serialport), but don't have your device connected for development or testing?

virtual-serialport provides a virtual drop-in replacement for an actual SerialPort object.

## Compatibility notes

We'll try to keep up to date with the latest `node-serialport` stable version. For compatibility with older versions of `node-serialport` you can install an older version of this library.

## Examples

```javascript
var SerialPort = require('node-serialport').SerialPort;
if (process.env.NODE_ENV == 'development') {
  SerialPort = require('virtual-serialport');
}

var sp = new SerialPort('/dev/ttyUSB0', { baudrate: 57600 }); // still works if NODE_ENV is set to development!

sp.on('open', function (err) {

  sp.on("data", function(data) {
    console.log("From Arduino: " + data);
  });

  if (process.env.NODE_ENV == 'development') {
    sp.on("dataToDevice", function(data) {
      sp.writeToComputer(data + " " + data + "!");
    });
  }

  sp.write("BLOOP"); // "From Arduino: BLOOP BLOOP!"
});
```

## Usage

```javascript
var VirtualSerialPort = require('virtual-serialport');
var sp = new VirtualSerialPort(path, [opts={}]);
```

instantiates a virtual SerialPort object. Currently does nothing with the parameters.

```javascript
var sp = new VirtualSerialPort("/dev/ttyUSB0");
// No device has to actually exist at /dev/ttyUSB0 :)
```

### Computer to device communication

```javascript
sp.on("data", function(data) {
	console.log("Computer says, " + data);
});

sp.writeToComputer("BLEEP!"); // "Computer says, BLEEP!"
```

### Device to computer communication

```javascript
sp.on("dataToDevice", function(data) {
	console.log("Arduino says, " + data);
});

sp.write("BLOOP!"); // "Arduino says, BLOOP!"
```

### node-serialport methods/events:

#### sp.open(callback)
Simulates the port opening. It returns the callback execution and emits the `open` event on
`process.nextTick()`

#### sp.write(data)
Writes data to the virtual device. Equivalent to `sp.emit("dataToDevice", data)`.

#### sp.isOpen() OR sp.isOpen (both supported)
Returns boolean indicating wether the port is open or not. It returns the value of `sp.open` which
you may set manually.

#### sp.pause()
Sets internal Pause status and make sure all data send by "writeToComputer" is stored for later delivery

#### sp.resume()
Release internal Pause status and send out all data that was stored during pause.

#### sp.flush(callback)
Cleans all stored data that may be stored during pause

#### sp.drain(callback)
This method is for API compatibility. It actually does nothing and returns the callback call.

#### sp.close(callback)
This method is for API compatibility. It actually does nothing and returns the callback call.

#### sp.on("open", function(err) { ... } )

Runs function once `SerialPort` is ready, as you would with an actual `SerialPort` instance.

#### sp.on("data", function(data) { ... })

Act on data sent to the computer, as you would with an actual `SerialPort` instance.

### Non node-serialport methods/events:

#### sp.writeToComputer(data);

Writes data to computer. Equivalent to `sp.emit("data", data)`
Outputs warning and do not write the if port was not opened before.

#### sp.on("dataToDevice", function(data) { ... })
Act on data sent to the device.

## Parsers

`node-serialport` is listed as an optional dependency. If some version of `node-serialport` is
installed, `virtual-serialport` will load it's parsers.

For more information about parsers, please refer to the specific version of `node-serialport` docs.

## TODO
- move to automated testing (assertions and more)
- better match voodootikigod's node-serialport api
