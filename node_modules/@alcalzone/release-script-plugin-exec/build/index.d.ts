import type { Context, Plugin, Stage } from "@alcalzone/release-script-core/types";
import type { Argv } from "yargs";
declare class ExecPlugin implements Plugin {
    readonly id = "exec";
    private _stages;
    get stages(): Stage[];
    defineCLIOptions(yargs: Argv<any>): Argv<any>;
    init(context: Context): void;
    private commands;
    executeStage(context: Context, stage: Stage): Promise<void>;
}
export default ExecPlugin;
//# sourceMappingURL=index.d.ts.map