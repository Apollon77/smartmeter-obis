import type { Context, Plugin, Stage } from "@alcalzone/release-script-core/types";
import type { Argv } from "yargs";
declare class GitPlugin implements Plugin {
    readonly id = "git";
    readonly stages: Stage[];
    defineCLIOptions(yargs: Argv<any>): Argv<any>;
    private executeCheckStage;
    private executeCommitStage;
    private executePushStage;
    private executeCleanupStage;
    executeStage(context: Context, stage: Stage): Promise<void>;
}
export default GitPlugin;
//# sourceMappingURL=index.d.ts.map