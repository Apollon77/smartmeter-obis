import type { CLI } from "./cli";
import type { Plugin } from "./plugin";
import type { System } from "./system";
export interface Context {
    /** Access to the CLI instance. */
    cli: CLI;
    /** Access to the system layer */
    sys: System;
    /** Which directory the release script is executed in */
    cwd: string;
    /** Command line arguments to the release script */
    argv: {
        /** Whether this is a dry run */
        dryRun: boolean;
        /** Log debug information */
        verbose: boolean;
        /** Additional plugins to load */
        plugins: string[];
        /** The desired version bump */
        bump?: string;
        preid?: string;
        /** Answer all (applicable) yes/no prompts with yes */
        yes: boolean;
        [arg: string]: string | number | boolean | string[] | number[] | boolean[] | undefined;
    };
    warnings: string[];
    errors: string[];
    /** An array of enabled plugins */
    plugins: Plugin[];
    /** Data storage to be used by plugins */
    getData<T>(key: string): T;
    hasData(key: string): boolean;
    setData(key: string, value: any): void;
}
//# sourceMappingURL=context.d.ts.map