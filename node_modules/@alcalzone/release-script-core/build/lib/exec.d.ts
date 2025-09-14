import execa, { ExecaChildProcess } from "execa";
export declare function execRaw(command: string, options?: execa.Options): ExecaChildProcess;
export declare function exec(file: string, args?: readonly string[], options?: execa.Options<string>): ExecaChildProcess;
export declare function exec(file: string, options?: execa.Options<string>): ExecaChildProcess;
//# sourceMappingURL=exec.d.ts.map