import type { Context, Plugin, Stage } from "@alcalzone/release-script-core/types";
import type { Argv } from "yargs";
declare class LicensePlugin implements Plugin {
    readonly id = "license";
    readonly stages: Stage[];
    defineCLIOptions(yargs: Argv<any>): Argv<any>;
    executeStage(context: Context, stage: Stage): Promise<void>;
}
export default LicensePlugin;
//# sourceMappingURL=index.d.ts.map