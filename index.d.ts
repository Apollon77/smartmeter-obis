import {ObisMeasurement} from './lib/ObisMeasurement';

export * as ObisNames from './lib/ObisNames';
export * as SmlUnits from './lib/protocols/SmlUnits';
export {ObisMeasurement}

export type ObisOptions = ObisBaseOptions & ObisProtocolOptions & ObisTransportOptions;
export type ObisLanguage = 'en' | 'de';


interface ObisBaseOptions {
    /**
     * optional, number of seconds to wait for next request or pause serial receiving, value 0 possible to restart directly after finishing one message, Default: is 300 (=5 Minutes)
     */
    requestInterval?: number;

    obisNameLanguage?: ObisLanguage;

    /**
     * optional, if smartmeter do not return complete OBIS IDs (without medium info) this will be used as fallback for name resolving
     */
    obisFallbackMedium?: number;

    /**
     * optional, values: 0 (no logging), 1 (basic logging), 2 (detailed logging), Default: 0
     */
    debug?: 0 | 1 | 2;

    /**
     * optional, logging function that accepts one parameter to log a string. Default is "console.log"
     */
    logger?: Function;
}


type ObisProtocolOptions = ObisSmlProtocolOptions | ObisD0ProtocolOptions | ObisJsonEfrProtocolOptions;

interface ObisSmlProtocolOptions {
    /**
     * required, value SmlProtocol, D0Protocol or JsonEfrProtocol
     */
    protocol: 'SmlProtocol';

    /**
     * required for SmlProtocol, if false and CRC checksum is invalid an Error is thrown
     */
    protocolSmlIgnoreInvalidCRC: boolean;

    /**
     * optional for SmlProtocol, if set defines the input Encoding of the data. Default
     * is "binary" (as received from a serial connection). Other options are
     * "ascii", "utf-8" or "base64"
     */
    protocolSmlInputEncoding: string;
}

interface ObisD0ProtocolOptions {
    /**
     * required, value SmlProtocol, D0Protocol or JsonEfrProtocol
     */
    protocol: 'D0Protocol';

    /**
     * optional for D0Protocol, number of wakeup NULL characters, default 0
     */
    protocolD0WakeupCharacters?: number;

    /**
     * optional for D0Protocol, device address (max 32 characters) for SignIn-Message, default empty
     */
    protocolD0DeviceAddress?: string;

    /**
     * optional for D0Protocol, command for SignIn-Message, default "?" to query mandatory fields, other values depending on device. You can provide multiple SignOn messages separated by a comma. The delay between them can be set by parameter anotherQueryDelay
     */
    protocolD0SignOnMessage?: string;

    /**
     * optional for D0Protocol, to ignore the mode send by the device set the correct D0 mode here. The mode send by the device in the identification message is ignored
     */
    protocolD0ModeOverwrite?: string;

    /**
     * optional for D0Protocol, when the D0 mode needs a baudrate changeover, but the device information from identification message is wrong, overwrite with this value
     */
    protocolD0BaudrateChangeoverOverwrite?: number;

    /**
     * optional for D0Protocol with SerialRequestResponseTransport when multiple SignOnMessages are given. Value is in ms, default 1000
     */
    anotherQueryDelay?: number;
}

interface ObisJsonEfrProtocolOptions {
    /**
     * required, value SmlProtocol, D0Protocol or JsonEfrProtocol
     */
    protocol: 'JsonEfrProtocol';
}


type ObisTransportOptions =
    ObisSerialTransportOptions
    | ObisHttpRequestTransportOptions
    | ObisLocalFileTransportOptions
    | ObisStdInTransportOptions
    | ObisTCPTransportOptions;

interface ObisSerialTransportOptions {
    /**
     * required, value SerialResponseTransport, SerialRequestResponseTransport, HttpRequestTransport, LocalFileTransport, StdInTransport or TCPTransport
     */
    transport: 'SerialResponseTransport' | 'SerialRequestResponseTransport';

    /**
     * required for Serial protocols, Serial device name, e.g. "/dev/ttyUSB0"
     */
    transportSerialPort: string;

    /**
     * optional, baudrate for initial serial connection, if not defined default values per Transport type are used (9600 for SerialResponseTransprt and 300 for SerialRequestResponseTransport)
     */
    transportSerialBaudrate?: number;

    /**
     * optional, Must be one of: 8, 7, 6, or 5.
     */
    transportSerialDataBits?: 8 | 7 | 6 | 5;

    /**
     * optional, Must be one of: 1 or 2.
     */
    transportSerialStopBits?: 1 | 2;

    /**
     * optional, Must be one of: 'none', 'even', 'mark', 'odd', 'space'
     */
    transportSerialParity?: 'none' | 'even' | 'mark' | 'odd' | 'space';

    /**
     * optional, default value is 300000 (means after 300000 bytes without a matching message an Error is thrown )
     */
    transportSerialMaxBufferSize?: number;

    /**
     * ms, optional, default value is 120000 (means after 120000ms without a matching message or new data an Error is thrown )
     */
    transportSerialMessageTimeout?: number;
}

interface ObisHttpRequestTransportOptions {
    /**
     * required, value SerialResponseTransport, SerialRequestResponseTransport, HttpRequestTransport, LocalFileTransport, StdInTransport or TCPTransport
     */
    transport: 'HttpRequestTransport';

    /**
     * required for HttpRequestTransport, Request URL to query data from
     */
    transportHttpRequestUrl: string;

    /**
     * optional for HttpRequestTransport, Timeout in ms, defaut 2000
     */
    transportHttpRequestTimeout?: number;
}

interface ObisLocalFileTransportOptions {
    /**
     * required, value SerialResponseTransport, SerialRequestResponseTransport, HttpRequestTransport, LocalFileTransport, StdInTransport or TCPTransport
     */
    transport: 'LocalFileTransport';

    /**
     * required for LocalFileTransport, File patch to read data from
     */
    transportLocalFilePath: string;
}

interface ObisStdInTransportOptions {
    /**
     * required, value SerialResponseTransport, SerialRequestResponseTransport, HttpRequestTransport, LocalFileTransport, StdInTransport or TCPTransport
     */
    transport: 'StdInTransport';

    /**
     * optional, default value is 300000 (means after 300000 bytes without a matching message an Error is thrown )
     */
    transportStdInMaxBufferSize?: number;

    /**
     * ms, optional, default value is 120000 (means after 120000ms without a matching message or new data an Error is thrown )
     */
    transportStdInMessageTimeout?: number;
}

interface ObisTCPTransportOptions {
    /**
     * required, value SerialResponseTransport, SerialRequestResponseTransport, HttpRequestTransport, LocalFileTransport, StdInTransport or TCPTransport
     */
    transport: 'TCPTransport';

    /**
     * optional, default value is 300000 (means after 300000 bytes without a matching message an Error is thrown )
     */
    transportTcpMaxBufferSize?: number;

    /**
     * ms, optional, default value is 120000 (means after 120000ms without a matching message or new data an Error is thrown )
     */
    transportTcpMessageTimeout?: number;
}


declare abstract class ObisTransport {
    process(): void;

    stop(callback?: () => void): void;
}


export function init(options: ObisOptions, callback: (err: Error, obisResult: { [obisId: string]: ObisMeasurement; }) => void): ObisTransport;
