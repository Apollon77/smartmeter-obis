import type { Context, Plugin, Stage } from "@alcalzone/release-script-core/types";
import type { Argv } from "yargs";
export declare type ChangelogLocation = "readme" | "changelog";
/** Extracts the current (work in progress) changelog from the complete changelog text */
export declare function extractCurrentChangelog(changelogText: string, versionHeaderPrefix: string, nextVersionPlaceholderRegex: RegExp): string | undefined;
export declare function parseChangelogFile(changelog: string, entryPrefix: string): {
    before: string;
    after: string;
    entries: string[];
};
declare class ChangelogPlugin implements Plugin {
    readonly id = "changelog";
    stages(context: Context): Stage[];
    defineCLIOptions(yargs: Argv<any>): Argv<any>;
    private executeCheckStage;
    private executeEditStage;
    private executeCleanupStage;
    executeStage(context: Context, stage: Stage): Promise<void>;
}
export default ChangelogPlugin;
//# sourceMappingURL=index.d.ts.map