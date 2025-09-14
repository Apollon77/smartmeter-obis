import type execa from "execa";
import type { ExecaChildProcess } from "execa";
export interface System {
    /** Functions to execute commands */
    execRaw(command: string, options: execa.Options): ExecaChildProcess;
    exec(file: string, args: readonly string[], options: execa.Options<string>): ExecaChildProcess;
    exec(file: string, options: execa.Options<string>): ExecaChildProcess;
}
//# sourceMappingURL=system.d.ts.map