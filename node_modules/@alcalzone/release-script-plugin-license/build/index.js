"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const release_script_core_1 = require("@alcalzone/release-script-core");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const tiny_glob_1 = __importDefault(require("tiny-glob"));
class LicensePlugin {
    constructor() {
        this.id = "license";
        this.stages = [release_script_core_1.DefaultStages.check];
    }
    defineCLIOptions(yargs) {
        return yargs.options({
            license: {
                string: true,
                array: true,
                description: `Globs matching the license files to check`,
                default: ["{LICENSE,README}{,.md}"],
            },
        });
    }
    async executeStage(context, stage) {
        if (stage.id === "check") {
            const globs = context.argv.license;
            const files = [];
            for (const pattern of globs) {
                files.push(...(await (0, tiny_glob_1.default)(pattern, {
                    cwd: context.cwd,
                    dot: true,
                })));
            }
            for (const file of files) {
                const filePath = path_1.default.join(context.cwd, file);
                if (!(await fs_extra_1.default.pathExists(filePath)))
                    continue;
                const fileContent = await fs_extra_1.default.readFile(filePath, "utf8");
                const regex = /copyright\s*(\(c\))?\s*(?<range>(?:\d{4}\s*-\s*)?(?<current>\d{4}))/gi;
                let match;
                let latest;
                while ((match = regex.exec(fileContent))) {
                    if (!latest ||
                        parseInt(match.groups.current) > parseInt(latest.groups.current)) {
                        latest = match;
                    }
                }
                if (!latest)
                    continue;
                const latestYear = parseInt(latest.groups.current);
                if (latestYear < new Date().getFullYear()) {
                    context.cli.error(`File "${file}" contains an outdated copyright year: ${latest.groups.range}`);
                }
            }
        }
    }
}
exports.default = LicensePlugin;
//# sourceMappingURL=index.js.map