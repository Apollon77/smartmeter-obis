"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const release_script_core_1 = require("@alcalzone/release-script-core");
const typeguards_1 = require("alcalzone-shared/typeguards");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const semver_1 = __importDefault(require("semver"));
const tiny_glob_1 = __importDefault(require("tiny-glob"));
function isArrayOfTuples(value) {
    if (!(0, typeguards_1.isArray)(value))
        return false;
    return value.every((v) => (0, typeguards_1.isArray)(v) && v.length === 2);
}
function isArrayOfStrings(value) {
    if (!(0, typeguards_1.isArray)(value))
        return false;
    return value.every((v) => typeof v === "string");
}
class VersionPlugin {
    constructor() {
        this.id = "version";
        this.stages = [release_script_core_1.DefaultStages.check, release_script_core_1.DefaultStages.edit];
        this.stageAfter = {
            check: "*",
        };
    }
    defineCLIOptions(yargs) {
        return yargs.options({
            versionFiles: {
                description: `Replace versions in additional files using regular expressions. Can only be configured with a config file - see documentation.`,
            },
        });
    }
    async executeCheckStage(context) {
        var _a, _b;
        const version = context.getData("version");
        const parsedVersion = semver_1.default.parse(version);
        const colors = context.cli.colors;
        let deleteLines = 2;
        let askOk = false;
        let preid = (_a = context.argv.preid) !== null && _a !== void 0 ? _a : (_b = parsedVersion === null || parsedVersion === void 0 ? void 0 : parsedVersion.prerelease) === null || _b === void 0 ? void 0 : _b[0];
        if (typeof preid !== "string" || !Number.isNaN(parseInt(preid, 10))) {
            preid = undefined;
        }
        if (!context.argv.bump) {
            context.cli.log(`Version bump not provided`);
            context.argv.bump = await context.cli.select("Please choose a version", [
                {
                    value: "major",
                    label: `${colors.bold(semver_1.default.inc(version, "major"))} (major)`,
                    hint: "Breaking changes were introduced. This may include new features and bugfixes.",
                },
                {
                    value: "minor",
                    label: `${colors.bold(semver_1.default.inc(version, "minor"))} (minor)`,
                    hint: "A new feature was added without breaking things. This may include bugfixes.",
                },
                {
                    value: "patch",
                    label: `${colors.bold(semver_1.default.inc(version, "patch"))} (patch)`,
                    hint: "A bug was fixed without adding new functionality.",
                },
                {
                    value: "prerelease",
                    label: `${colors.bold(semver_1.default.inc(version, "prerelease", preid !== null && preid !== void 0 ? preid : "alpha"))} or similar (prerelease)`,
                    hint: "Bump an existing prerelease suffix, behaves like prepatch otherwise.",
                },
                {
                    value: "premajor",
                    label: `${colors.bold(semver_1.default.inc(version, "premajor", preid !== null && preid !== void 0 ? preid : "alpha"))} or similar (premajor)`,
                    hint: "To provide test versions before a major release.",
                },
                {
                    value: "preminor",
                    label: `${colors.bold(semver_1.default.inc(version, "preminor", preid !== null && preid !== void 0 ? preid : "alpha"))} or similar (preminor)`,
                    hint: "To provide test versions before a minor release.",
                },
                {
                    value: "prepatch",
                    label: `${colors.bold(semver_1.default.inc(version, "prepatch", preid !== null && preid !== void 0 ? preid : "alpha"))} or similar (prepatch)`,
                    hint: "To provide test versions before a patch release.",
                },
            ]);
            deleteLines++;
        }
        else {
            askOk = true;
        }
        if (context.argv.bump.startsWith("pre")) {
            context.argv.preid = (await context.cli.ask("Please enter the desired prerelease identifier", preid !== null && preid !== void 0 ? preid : "alpha")).trim();
            deleteLines++;
            askOk = true;
        }
        else {
            context.argv.preid = undefined;
        }
        const newVersion = semver_1.default.inc(version, context.argv.bump, context.argv.preid);
        context.cli.log(`Bumping version from ${version} to ${newVersion}`);
        if (askOk && !context.argv.yes) {
            const ok = (await context.cli.select("Is this okay?", [
                {
                    value: "yes",
                    label: "yes",
                },
                {
                    value: "no",
                    label: "no",
                },
            ])) === "yes";
            if (!ok)
                context.cli.fatal("Aborted by user");
            deleteLines++;
        }
        context.cli.clearLines(deleteLines);
        context.cli.log(`Bumping version from ${colors.blue(version)} to ${colors.green(newVersion)} ${colors.green("✔")}`);
        context.setData("version_new", newVersion);
        // Check versionFiles if given
        if (context.argv.versionFiles != undefined) {
            if (isArrayOfTuples(context.argv.versionFiles)) {
                // eslint-disable-next-line prefer-const
                for (let [pattern, re] of context.argv.versionFiles) {
                    if (typeof re === "string")
                        re = [re];
                    if (!isArrayOfStrings(re)) {
                        context.cli.error(`Invalid option versionFiles: replacement pattern for glob "${pattern}" must be a string or an array of strings!`);
                        continue;
                    }
                    // Test regular expressions
                    for (const r of re) {
                        try {
                            new RegExp(r, "g");
                        }
                        catch (e) {
                            context.cli.error(`Invalid option versionFiles: replacement pattern for glob "${pattern}" contains invalid regular expression "${r}"!`);
                        }
                    }
                }
            }
            else {
                context.cli.error(`Option versionFiles must be an array of tuples`);
            }
        }
    }
    async executeEditStage(context) {
        if (context.argv.versionFiles != undefined) {
            context.cli.log(`Updating version in additional files`);
            const newVersion = context.getData("version_new");
            // eslint-disable-next-line prefer-const
            for (let [pattern, re] of context.argv.versionFiles) {
                if (typeof re === "string")
                    re = [re];
                const files = await (0, tiny_glob_1.default)(pattern, {
                    cwd: context.cwd,
                    dot: true,
                });
                for (const file of files) {
                    const filePath = path_1.default.join(context.cwd, file);
                    if (!(await fs_extra_1.default.pathExists(filePath)))
                        continue;
                    if (context.argv.verbose) {
                        context.cli.log(`Updating version in ${file}`);
                    }
                    if (!context.argv.dryRun) {
                        let fileContent = await fs_extra_1.default.readFile(filePath, "utf8");
                        // Apply replacements
                        for (const r of re) {
                            const regex = new RegExp(r, "g");
                            fileContent = fileContent.replace(regex, newVersion);
                        }
                        await fs_extra_1.default.writeFile(filePath, fileContent, "utf8");
                    }
                }
            }
        }
    }
    async executeStage(context, stage) {
        if (stage.id === "check") {
            await this.executeCheckStage(context);
        }
        else if (stage.id === "edit") {
            await this.executeEditStage(context);
        }
    }
}
exports.default = VersionPlugin;
//# sourceMappingURL=index.js.map