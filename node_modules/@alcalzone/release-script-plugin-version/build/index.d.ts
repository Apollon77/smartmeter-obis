import type { Context, Plugin, Stage } from "@alcalzone/release-script-core/types";
import type { Argv } from "yargs";
declare class VersionPlugin implements Plugin {
    readonly id = "version";
    readonly stages: Stage[];
    readonly stageAfter: {
        check: "*";
    };
    defineCLIOptions(yargs: Argv<any>): Argv<any>;
    private executeCheckStage;
    private executeEditStage;
    executeStage(context: Context, stage: Stage): Promise<void>;
}
export default VersionPlugin;
//# sourceMappingURL=index.d.ts.map