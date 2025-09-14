# Smartmeter OBIS Library
The smartmeter-obis library is a Node.js library for reading and parsing smartmeter data using OBIS (Object Identification System) protocols. It supports SML (Smart Message Language), D0 protocol, and JSON EFR formats with various transport methods including serial, HTTP, TCP, and local file.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Bootstrap and test the repository:
  - Ensure Node.js 16.x+ is available: `node --version` (requires >= 16.0.0)
  - Install dependencies: `npm install` -- takes 20 seconds
  - Run tests: `npm test` -- takes 9+ minutes. NEVER CANCEL. Set timeout to 15+ minutes.
- ESLint is available for code quality:
  - Install ESLint v8: `npm install --save-dev eslint@8`
  - Run linting: `npx eslint index.js lib/ test/ --max-warnings 0` -- takes 1-2 seconds but reports many legacy issues
  - Note: ESLint reports 367+ errors due to legacy code style; these are not blocking for normal development
- Build process:
  - NO build step needed - this is a pure JavaScript library
  - Main entry point: `index.js`
  - TypeScript definitions: `index.d.ts`

## Validation
- Always test your changes with realistic scenarios using the library APIs
- Test with LocalFileTransport using existing test data: `test/direct/ttyUSB0.dump`
- Example validation code:
  ```javascript
  var SmartmeterObis = require('./index.js');
  var options = {
      'protocol': 'SmlProtocol',
      'transport': 'LocalFileTransport',
      'transportLocalFilePath': './test/direct/ttyUSB0.dump',
      'requestInterval': -1,
      'obisNameLanguage': 'en'
  };
  function displayData(err, obisResult) {
      if (err) { console.log('ERROR: ' + err); return; }
      console.log('SUCCESS: ' + Object.keys(obisResult).length + ' measurements');
  }
  var smTransport = SmartmeterObis.init(options, displayData);
  smTransport.process();
  ```
- Always run `npm test` before committing changes -- NEVER CANCEL, wait full 15+ minutes
- You cannot test serial port functionality without actual hardware

## Command Timeouts and Timing
- **CRITICAL**: `npm test` takes 9+ minutes - NEVER CANCEL. Set timeout to 15+ minutes minimum
- `npm install` takes ~20 seconds
- ESLint runs in 1-2 seconds
- Simple test runs complete in 1-5 seconds

## Common Tasks
The following are outputs from frequently run commands to save time:

### Repository Structure
```
├── index.js              # Main entry point
├── index.d.ts            # TypeScript definitions  
├── package.json          # Dependencies and scripts
├── lib/                  # Core library code
│   ├── ObisMeasurement.js    # OBIS measurement class
│   ├── ObisNames.js          # OBIS name resolution
│   ├── protocols/            # Protocol implementations
│   │   ├── D0Protocol.js     # D0/IEC 62056-21 protocol
│   │   ├── SmlProtocol.js    # SML (Smart Message Language)
│   │   └── JsonEfrProtocol.js # JSON EFR format
│   └── transports/           # Transport implementations
│       ├── SerialRequestResponseTransport.js
│       ├── SerialResponseTransport.js
│       ├── HttpRequestTransport.js
│       ├── LocalFileTransport.js
│       ├── StdInTransport.js
│       └── TCPTransport.js
├── test/                 # Test files and test data
│   ├── direct/           # Direct test examples and sample data
│   └── test*.js          # Mocha test suites
└── .github/workflows/    # CI/CD pipelines
```

### Key npm Scripts
```
npm install               # Install dependencies (20 seconds)
npm test                  # Run all tests (9+ minutes, NEVER CANCEL)
npm run release          # Release management (uses release-script)
```

### Example Usage Patterns
The library is used by initializing with options and providing a callback:
```javascript
// Basic pattern
var SmartmeterObis = require('smartmeter-obis');
var options = { protocol: '...', transport: '...', /* ... */ };
var smTransport = SmartmeterObis.init(options, callbackFunction);
smTransport.process();
```

### Supported Protocols
- **SmlProtocol**: Binary SML (Smart Message Language) format
- **D0Protocol**: ASCII D0 protocol (IEC 62056-21:2002)
- **JsonEfrProtocol**: JSON format from EFR Smart Grid Hub

### Supported Transports  
- **SerialResponseTransport**: Serial push data (no requests)
- **SerialRequestResponseTransport**: Serial request-response (D0 modes A-D)
- **HttpRequestTransport**: HTTP requests to URLs
- **LocalFileTransport**: Read from local files
- **StdInTransport**: Read from stdin
- **TCPTransport**: Read from TCP sockets

### Testing Strategy
- Unit tests use mocked serial ports and test data files
- Test data located in `test/direct/` including `ttyUSB0.dump`, `ttyUSB0-2.dump`, etc.
- Tests cover error handling, protocol parsing, transport methods
- 43 total tests, all should pass
- Serial port tests use virtual-serialport library for mocking

### Development Notes
- Library requires Node.js 16.x+ (specified in package.json engines)
- Uses legacy dependencies: request (deprecated), serialport@12.x
- ESLint configuration is legacy format (.eslintrc) with many style violations
- No build step required - pure JavaScript library
- TypeScript definitions provided for better IDE support
- CI/CD runs on Node 16.x, 18.x, 20.x across Ubuntu/Windows/macOS