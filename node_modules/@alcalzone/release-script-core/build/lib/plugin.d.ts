import type { Argv } from "yargs";
import type { Context } from "./context";
import type { ConstOrDynamic } from "./shared";
import type { Stage } from "./stage";
export interface Plugin {
    /** A unique identifier for this plugin */
    readonly id: string;
    /** Define which plugins are required by this plugin and need to be included */
    readonly dependencies?: string[];
    /** Will be called before anything else */
    init?: (context: Context) => Promise<void> | void;
    /** Allows a plugin to define additional CLI options */
    defineCLIOptions?: <T>(yargs: Argv<T>) => Argv<T>;
    /** Allows a plugin to define additional stages in the release process */
    stages?: ConstOrDynamic<Stage[]>;
    /**
     * For each stage, define after which plugin this one hooks into the release process.
     * Without dependencies, plugins are executed in the order they are defined.
     *
     * This is evaluated at the start of each stage, so a reaction to previous stage results is possible
     */
    stageAfter?: Record<string, ConstOrDynamic<string[] | "*">>;
    /**
     * For each stage, define after which plugin this one hooks into the release process.
     * Without dependencies, plugins are executed in the order they are defined.
     *
     * This is evaluated at the start of each stage, so a reaction to previous stage results is possible
     */
    stageBefore?: Record<string, ConstOrDynamic<string[] | "*">>;
    /** Execute the plugin for the given stage */
    executeStage(context: Context, stage: Stage): Promise<void>;
}
//# sourceMappingURL=plugin.d.ts.map