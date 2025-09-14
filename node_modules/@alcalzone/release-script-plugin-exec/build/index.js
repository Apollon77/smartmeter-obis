"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const release_script_core_1 = require("@alcalzone/release-script-core");
const typeguards_1 = require("alcalzone-shared/typeguards");
class ExecPlugin {
    constructor() {
        this.id = "exec";
        this._stages = [];
        // dependencies?: string[] | undefined;
        // stageAfter?: Record<string, ConstOrDynamic<string[]>> | undefined;
        // stageBefore?: Record<string, ConstOrDynamic<string[]>> | undefined;
        this.commands = {};
    }
    get stages() {
        return this._stages;
    }
    defineCLIOptions(yargs) {
        return yargs.options({
            exec: {
                alias: ["x"],
                description: `Define custom commands to be executed during the release process. Example:
--exec.before_commit="echo Hello World!"`,
            },
        });
    }
    init(context) {
        var _a, _b, _c, _d, _e;
        const commands = ((_a = context.argv.exec) !== null && _a !== void 0 ? _a : {});
        if ((0, typeguards_1.isObject)(commands) &&
            Object.keys(commands).every((c) => typeof c === "string") &&
            Object.values(commands).every((c) => typeof c === "string" || ((0, typeguards_1.isArray)(c) && c.every((c) => typeof c === "string")))) {
            // Parse provided commands into stages
            const stages = new Map();
            for (const stage of Object.keys(commands)) {
                if (stages.has(stage))
                    continue;
                if (stage in release_script_core_1.DefaultStages) {
                    stages.set(stage, release_script_core_1.DefaultStages[stage]);
                }
                else if (stage.startsWith("before_")) {
                    const beforeStage = stage.substr(7);
                    const afterStages = Object.values(release_script_core_1.DefaultStages)
                        .filter((s) => { var _a; return (_a = s.before) === null || _a === void 0 ? void 0 : _a.includes(beforeStage); })
                        .map((s) => s.id);
                    // Make sure the before_xxx stages come after the previous stage and their after_xxx stages
                    afterStages.push(...((_c = (_b = release_script_core_1.DefaultStages[beforeStage]) === null || _b === void 0 ? void 0 : _b.after) !== null && _c !== void 0 ? _c : []));
                    for (const afterStage of afterStages) {
                        if (`after_${afterStage}` in commands) {
                            afterStages.push(`after_${afterStage}`);
                        }
                    }
                    stages.set(stage, {
                        id: stage,
                        before: [beforeStage],
                        after: afterStages.length ? afterStages : undefined,
                    });
                }
                else if (stage.startsWith("after_")) {
                    const afterStage = stage.substr(6);
                    const beforeStages = Object.values(release_script_core_1.DefaultStages)
                        .filter((s) => { var _a; return (_a = s.after) === null || _a === void 0 ? void 0 : _a.includes(afterStage); })
                        .map((s) => s.id);
                    // Make sure the after_xxx stages come before the next stage and their before_xxx stages
                    beforeStages.push(...((_e = (_d = release_script_core_1.DefaultStages[afterStage]) === null || _d === void 0 ? void 0 : _d.before) !== null && _e !== void 0 ? _e : []));
                    for (const beforeStage of beforeStages) {
                        if (`before_${beforeStage}` in commands) {
                            beforeStages.push(`before_${beforeStage}`);
                        }
                    }
                    stages.set(stage, {
                        id: stage,
                        before: beforeStages.length ? beforeStages : undefined,
                        after: [afterStage],
                    });
                }
                else {
                    stages.set(stage, {
                        id: stage,
                    });
                }
            }
            this.commands = commands;
            this._stages = [...stages.values()];
        }
        else {
            context.cli.fatal(`Argument "exec" is invalid. Must be an object containing strings or string arrays! Got ${JSON.stringify(commands)}`);
        }
    }
    async executeStage(context, stage) {
        var _a;
        let commands = this.commands[stage.id];
        if (!commands)
            return;
        // Normalize commands to an array
        if (typeof commands === "string") {
            commands = [commands];
        }
        // Execute commands
        const colors = context.cli.colors;
        for (const command of commands) {
            context.cli.logCommand(command);
            if (!context.argv.dryRun) {
                const promise = context.sys.execRaw(command, { cwd: context.cwd });
                (_a = promise.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => {
                    context.cli.log(colors.gray(context.cli.stripColors(data.toString().replace(/\r?\n$/, ""))));
                });
                await promise;
            }
        }
    }
}
exports.default = ExecPlugin;
//# sourceMappingURL=index.js.map