"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseChangelogFile = exports.extractCurrentChangelog = void 0;
const release_script_core_1 = require("@alcalzone/release-script-core");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const changelogMarkers = ["**WORK IN PROGRESS**", "__WORK IN PROGRESS__"];
function buildChangelogPlaceholderRegex(changelogPlaceholderPrefix) {
    return () => new RegExp(`^${changelogPlaceholderPrefix} (?:${changelogMarkers
        .map((m) => m.replace(/\*/g, "\\*"))
        .join("|")})(.*?)$`, "gm");
}
/** Extracts the current (work in progress) changelog from the complete changelog text */
function extractCurrentChangelog(changelogText, versionHeaderPrefix, nextVersionPlaceholderRegex) {
    const match = nextVersionPlaceholderRegex.exec(changelogText);
    if (!match)
        return;
    const start = match.index + match[0].length;
    let entry = changelogText.slice(start);
    const nextHeadlineRegex = new RegExp(`^${versionHeaderPrefix} `, "gm");
    const matchEnd = nextHeadlineRegex.exec(entry);
    if (matchEnd) {
        entry = entry.slice(0, matchEnd.index);
    }
    return entry.trim();
}
exports.extractCurrentChangelog = extractCurrentChangelog;
function parseChangelogFile(changelog, entryPrefix) {
    const escapedMarkers = changelogMarkers.map((m) => m.replace(/\*/g, "\\*"));
    const versionAndDate = "v?\\d+\\.\\d+\\.\\d+(.+?\\(\\d{4}\\-\\d{2}\\-\\d{2}\\))?";
    const changelogEntryRegex = new RegExp(
    // match changelog headline with optional free text at the end
    `^${entryPrefix} (?:${[...escapedMarkers, versionAndDate].join("|")}).*?$`, "gm");
    let matchStart;
    let firstStartIndex;
    let lastEndIndex;
    const entries = [];
    while ((matchStart = changelogEntryRegex.exec(changelog))) {
        let entry = changelog.slice(matchStart.index);
        // The next headline must start with the same or lower amount of prefix chars as the current one
        const nextHeadlineRegex = new RegExp(`^${entryPrefix[0]}{${entryPrefix.length - 1},${entryPrefix.length}}(?!${entryPrefix[0]})`, "gm");
        const matchEnd = nextHeadlineRegex.exec(entry.slice(matchStart[0].length));
        if (matchEnd) {
            entry = entry.slice(0, matchStart[0].length + matchEnd.index);
        }
        entries.push(entry.trim());
        // Remember where the changelog starts and ends
        if (!firstStartIndex)
            firstStartIndex = matchStart.index;
        lastEndIndex = matchStart.index + entry.length;
    }
    if (!firstStartIndex) {
        // no entries found
        return {
            before: changelog,
            after: "",
            entries: [],
        };
    }
    else {
        return {
            before: changelog.slice(0, firstStartIndex),
            after: changelog.slice(lastEndIndex),
            entries,
        };
    }
}
exports.parseChangelogFile = parseChangelogFile;
class ChangelogPlugin {
    constructor() {
        this.id = "changelog";
    }
    stages(context) {
        const ret = [release_script_core_1.DefaultStages.check, release_script_core_1.DefaultStages.edit];
        if (context.argv.addPlaceholder) {
            ret.push(release_script_core_1.DefaultStages.cleanup);
        }
        return ret;
    }
    defineCLIOptions(yargs) {
        return yargs.options({
            numChangelogEntries: {
                alias: ["n"],
                type: "number",
                description: `How many changelog entries should be kept in README.md. Only applies when README.md and CHANGELOG_OLD.md exist.`,
                default: 5,
            },
            addPlaceholder: {
                type: "boolean",
                description: `Add an empty placeholder to the changelog after a release.`,
                default: false,
            },
        });
    }
    // dependencies?: string[] | undefined;
    // stageAfter?: Record<string, ConstOrDynamic<string[]>> | undefined;
    // stageBefore?: Record<string, ConstOrDynamic<string[]>> | undefined;
    async executeCheckStage(context) {
        var _a;
        // The changelog must either be in CHANGELOG.md or README.md
        const changelogPath = path_1.default.join(context.cwd, "CHANGELOG.md");
        const readmePath = path_1.default.join(context.cwd, "README.md");
        // CHANGELOG_OLD is only used if the main changelog is in the readme
        const changelogOldPath = path_1.default.join(context.cwd, "CHANGELOG_OLD.md");
        let changelog;
        let changelogFilename;
        let changelogLocation;
        let changelogOld;
        let changelogPlaceholderPrefix = "##";
        if (await fs_extra_1.default.pathExists(changelogPath)) {
            changelog = await fs_extra_1.default.readFile(changelogPath, "utf8");
            changelogFilename = path_1.default.basename(changelogPath);
            changelogLocation = "changelog";
        }
        else if (await fs_extra_1.default.pathExists(readmePath)) {
            changelog = await fs_extra_1.default.readFile(readmePath, "utf8");
            changelogFilename = path_1.default.basename(readmePath);
            changelogLocation = "readme";
            // The changelog is indented one more level in the readme
            changelogPlaceholderPrefix += "#";
        }
        else {
            context.cli.fatal("No CHANGELOG.md or README.md found in the current directory!");
        }
        if (changelogLocation === "readme" && (await fs_extra_1.default.pathExists(changelogOldPath))) {
            changelogOld = await fs_extra_1.default.readFile(changelogOldPath, "utf8");
        }
        // Parse changelog entries
        const parsed = parseChangelogFile(changelog, changelogPlaceholderPrefix);
        const changelogHasFinalNewline = changelog.replace(/(\r|\n|\r\n)/g, "\n").endsWith("\n");
        let parsedOld;
        if (changelogOld) {
            parsedOld = parseChangelogFile(changelogOld, changelogPlaceholderPrefix.substr(1));
        }
        const entries = [...parsed.entries, ...((_a = parsedOld === null || parsedOld === void 0 ? void 0 : parsedOld.entries) !== null && _a !== void 0 ? _a : [])];
        context.setData("changelog_filename", changelogFilename);
        context.setData("changelog_before", parsed.before);
        context.setData("changelog_after", parsed.after);
        context.setData("changelog_final_newline", changelogHasFinalNewline);
        context.setData("changelog_location", changelogLocation);
        context.setData("changelog_entry_prefix", changelogPlaceholderPrefix);
        if (parsedOld) {
            context.setData("changelog_old_before", parsedOld.before);
            context.setData("changelog_old_after", parsedOld.after);
            const changelogOldHasFinalNewline = changelogOld
                .replace(/(\r|\n|\r\n)/g, "\n")
                .endsWith("\n");
            context.setData("changelog_old_final_newline", changelogOldHasFinalNewline);
        }
        // check if the changelog contains exactly 1 occurence of the changelog placeholder
        const getPlaceholderRegex = buildChangelogPlaceholderRegex(changelogPlaceholderPrefix);
        // There are several possible changelog markers:
        // But we only output the primary one
        const changelogPlaceholder = `${changelogPlaceholderPrefix} ${changelogMarkers[0]}`;
        const currentChangelogs = entries.filter((e) => getPlaceholderRegex().test(e));
        switch (currentChangelogs.length) {
            case 0:
                context.cli.error(`The changelog placeholder is missing from ${changelogFilename}!
Please add the following line to your changelog:
${changelogPlaceholder}`);
                break;
            case 1:
                {
                    // Ok, extract the current changelog body for further processing
                    const currentChangelogBody = currentChangelogs[0]
                        .split("\n")
                        .slice(1)
                        .join("\n")
                        .trim();
                    // And make sure it is not empty
                    if (!currentChangelogBody) {
                        context.cli.error("The changelog for the next version is empty!");
                    }
                    else {
                        // Place the current changelog at the top
                        context.setData("changelog_entries", [
                            currentChangelogs[0],
                            ...entries.filter((e) => e !== currentChangelogs[0]),
                        ]);
                        // And save the body separately
                        context.setData("changelog_new", currentChangelogBody);
                        context.cli.log(`changelog ok ${context.cli.colors.green("✔")}`);
                    }
                }
                break; // all good
            default:
                context.cli.error(`There is more than one changelog placeholder in ${changelogFilename}!`);
        }
    }
    async executeEditStage(context) {
        const changelogFilename = context.getData("changelog_filename");
        const changelogBefore = context.getData("changelog_before").trimEnd();
        const changelogEntries = context.getData("changelog_entries");
        const changelogAfter = context.getData("changelog_after").trimStart();
        const changelogHasFinalNewline = context.getData("changelog_final_newline");
        const prefix = context.getData("changelog_entry_prefix");
        const newVersion = context.getData("version_new");
        const hasChangelogOld = context.hasData("changelog_old_before") && context.hasData("changelog_old_after");
        const changelogOldHasFinalNewline = context.hasData("changelog_old_final_newline") &&
            context.getData("changelog_old_final_newline");
        // Replace the changelog placeholder and keep the free text
        const placeholderRegex = buildChangelogPlaceholderRegex(prefix)();
        let currentChangelog = changelogEntries[0];
        currentChangelog = currentChangelog.replace(placeholderRegex, `${prefix} ${newVersion} (${new Date().toISOString().split("T")[0]})$1`);
        changelogEntries[0] = currentChangelog;
        if (hasChangelogOld) {
            // If there's a CHANGELOG_OLD.md, we need to split the changelog
            const numNew = context.argv.numChangelogEntries;
            const normalizedEntries = changelogEntries.map((e) => e.replace(/^#+/, ""));
            const entriesNew = normalizedEntries.slice(0, numNew).map((e) => prefix + e + "\n\n");
            const entriesOld = normalizedEntries
                .slice(numNew)
                .map((e) => prefix.slice(1) + e + "\n\n");
            const changelogOldBefore = context.getData("changelog_old_before").trimEnd();
            const changelogOldAfter = context.getData("changelog_old_after").trimStart();
            context.cli.log(`Updating changelog in ${changelogFilename}`);
            await fs_extra_1.default.writeFile(path_1.default.join(context.cwd, changelogFilename), (changelogBefore + "\n" + entriesNew.join("") + changelogAfter).trim() +
                (changelogHasFinalNewline ? "\n" : ""));
            context.cli.log(`Updating changelog in CHANGELOG_OLD.md`);
            await fs_extra_1.default.writeFile(path_1.default.join(context.cwd, "CHANGELOG_OLD.md"), (changelogOldBefore + "\n" + entriesOld.join("") + changelogOldAfter).trim() +
                (changelogOldHasFinalNewline ? "\n" : ""));
        }
        else {
            const normalizedEntries = changelogEntries
                .map((e) => e.replace(/^#+/, ""))
                .map((e) => prefix + e + "\n\n");
            context.cli.log(`Updating changelog in ${changelogFilename}`);
            await fs_extra_1.default.writeFile(path_1.default.join(context.cwd, changelogFilename), (changelogBefore + "\n" + normalizedEntries.join("") + changelogAfter).trim() +
                (changelogHasFinalNewline ? "\n" : ""));
        }
    }
    async executeCleanupStage(context) {
        const changelogFilename = context.getData("changelog_filename");
        const changelogBefore = context.getData("changelog_before").trimEnd();
        const prefix = context.getData("changelog_entry_prefix");
        const changelogPath = path_1.default.join(context.cwd, changelogFilename);
        let fileContent = await fs_extra_1.default.readFile(changelogPath, "utf8");
        fileContent = `${fileContent.slice(0, changelogBefore.length)}
${prefix} ${changelogMarkers[0]}
${fileContent.slice(changelogBefore.length)}`; // The part after the new placeholder contains a leading newline, so we don't need an extra one here
        await fs_extra_1.default.writeFile(changelogPath, fileContent);
    }
    async executeStage(context, stage) {
        if (stage.id === "check") {
            await this.executeCheckStage(context);
        }
        else if (stage.id === "edit") {
            if (context.argv.dryRun) {
                context.cli.log("Dry run, would update changelog");
            }
            else {
                await this.executeEditStage(context);
            }
        }
        else if (stage.id === "cleanup" && context.argv.addPlaceholder) {
            if (context.argv.dryRun) {
                context.cli.log("Dry run, would add placeholder to changelog");
            }
            else {
                await this.executeCleanupStage(context);
            }
        }
    }
}
exports.default = ChangelogPlugin;
//# sourceMappingURL=index.js.map