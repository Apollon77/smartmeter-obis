import type { Context } from "./context";
import type { Plugin } from "./plugin";
import { Stage } from "./stage";
/** Resolve all plugins that are required by the chosen plugins */
export declare function resolvePlugins(allPlugins: Plugin[], chosenPluginIds: string[]): Plugin[];
export declare function planStages(context: Context): Promise<Stage[]>;
export declare function planStage(context: Context, stage: Stage): Promise<Plugin[]>;
/** Plans all stages of the given context and executes them in the correct order */
export declare function execute(context: Context): Promise<void>;
//# sourceMappingURL=planner.d.ts.map