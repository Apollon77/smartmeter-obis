import type { Context, Plugin, Stage } from "@alcalzone/release-script-core/types";
import type { Argv } from "yargs";
declare class PackagePlugin implements Plugin {
    readonly id = "package";
    readonly stages: Stage[];
    defineCLIOptions(yargs: Argv<any>): Argv<any>;
    readonly stageBefore: {
        commit: string[];
    };
    readonly stageAfter: {
        commit: (context: Context) => string[];
    };
    private executeCheckStage;
    private executeEditStage;
    private executeEditStageYarnMonorepo;
    executeStage(context: Context, stage: Stage): Promise<void>;
}
export default PackagePlugin;
//# sourceMappingURL=index.d.ts.map