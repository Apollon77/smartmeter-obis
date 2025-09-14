"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const release_script_core_1 = require("@alcalzone/release-script-core");
const arrays_1 = require("alcalzone-shared/arrays");
const enquirer_1 = require("enquirer");
const picocolors_1 = __importDefault(require("picocolors"));
const yargs_1 = __importDefault(require("yargs"));
function colorizeTextAndTags(textWithTags, textColor, bgColor) {
    return textColor(textWithTags.replace(/\[(.*?)\]/g, (match, group1) => bgColor("[") + picocolors_1.default.inverse(group1) + bgColor("]")));
}
const prefixColors = [
    picocolors_1.default.magenta,
    picocolors_1.default.cyan,
    picocolors_1.default.yellow,
    picocolors_1.default.red,
    picocolors_1.default.green,
    picocolors_1.default.blue,
    picocolors_1.default.white,
];
const usedPrefixes = [];
function colorizePrefix(prefix) {
    if (!prefix.includes(":"))
        return picocolors_1.default.white(prefix);
    const prefixShort = prefix.split(":").slice(-1)[0];
    let prefixIndex = usedPrefixes.indexOf(prefixShort);
    if (prefixIndex === -1) {
        usedPrefixes.push(prefixShort);
        prefixIndex = usedPrefixes.length - 1;
    }
    return prefixColors[prefixIndex % prefixColors.length](prefix);
}
function prependPrefix(prefix, str) {
    if (!prefix)
        return str;
    return picocolors_1.default.bold(colorizePrefix(prefix)) + " " + str;
}
class CLI {
    constructor(context) {
        this.context = context;
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        this.prefix = "";
        this.colors = picocolors_1.default;
        this.stripColors = release_script_core_1.stripColors;
    }
    log(msg) {
        console.log(prependPrefix(this.context.cli.prefix, msg));
    }
    warn(msg) {
        console.warn(prependPrefix(this.context.cli.prefix, colorizeTextAndTags(`[WARN] ${msg}`, picocolors_1.default.yellow, picocolors_1.default.bgYellow)));
        this.context.warnings.push(msg);
    }
    error(msg) {
        console.error(prependPrefix(this.context.cli.prefix, colorizeTextAndTags(`[ERR] ${msg}`, picocolors_1.default.red, picocolors_1.default.bgRed)));
        this.context.errors.push(msg);
    }
    fatal(msg, code) {
        throw new release_script_core_1.ReleaseError(msg, true, code);
    }
    logCommand(command, args) {
        if (args === null || args === void 0 ? void 0 : args.length) {
            command += ` ${args.join(" ")}`;
        }
        this.log(`$ ${command}`);
    }
    clearLines(lines) {
        process.stdout.moveCursor(0, -lines);
        process.stdout.clearScreenDown();
    }
    async select(question, options) {
        try {
            const result = await (0, enquirer_1.prompt)({
                name: "default",
                message: question,
                type: "select",
                choices: options.map((o) => ({
                    name: o.value,
                    message: o.label,
                    hint: o.hint ? this.colors.gray(`· ${o.hint}`) : undefined,
                })),
            });
            return result.default;
        }
        catch (e) {
            // Strg+C
            if (e === "")
                this.fatal("Aborted by user");
            throw e;
        }
    }
    async ask(question, placeholder) {
        try {
            const result = await (0, enquirer_1.prompt)({
                name: "default",
                message: question,
                type: "input",
                initial: placeholder,
            });
            return result.default;
        }
        catch (e) {
            // Strg+C
            if (e === "")
                this.fatal("Aborted by user");
            throw e;
        }
    }
}
async function main() {
    var _a, _b, _c, _d;
    let argv = yargs_1.default
        .env("RELEASE_SCRIPT")
        .usage("$0 [<bump> [<preid>]] [options]", "AlCalzone's release script", (yargs) => yargs
        .positional("bump", {
        describe: "The version bump to do.",
        choices: [
            "major",
            "premajor",
            "minor",
            "preminor",
            "patch",
            "prepatch",
            "prerelease",
        ],
        required: false,
    })
        .positional("preid", {
        describe: "The prerelease identifier. Only for pre* bumps.",
        required: false,
    }))
        .wrap(yargs_1.default.terminalWidth())
        // Delay showing help until the second parsing pass
        .help(false)
        .alias("v", "version")
        .options({
        config: {
            alias: "c",
            describe: "Path to the release config file",
            config: true,
            default: ".releaseconfig.json",
        },
        plugins: {
            alias: "p",
            describe: "Additional plugins to load",
            string: true,
            array: true,
        },
        verbose: {
            alias: "V",
            type: "boolean",
            description: "Enable debug output",
            default: false,
        },
        yes: {
            alias: "y",
            type: "boolean",
            description: "Answer all (applicable) yes/no prompts with yes",
            default: false,
        },
        publishAll: {
            type: "boolean",
            description: `Bump and publish all non-private packages in monorepos, even if they didn't change`,
            default: false,
        },
    });
    // We do two-pass parsing:
    // 1. parse the config file and plugins (non-strict)
    // 2. parse all options (strict)
    let parsedArgv = (await argv.parseAsync());
    const chosenPlugins = (0, arrays_1.distinct)([
        // These plugins must always be loaded
        "git",
        "package",
        "exec",
        "version",
        "changelog",
        // These are provided by the user
        ...(parsedArgv.plugins || []),
    ]);
    const allPlugins = await Promise.all(chosenPlugins.map(async (plugin) => new (await Promise.resolve().then(() => __importStar(require(`@alcalzone/release-script-plugin-${plugin}`)))).default()));
    const plugins = (0, release_script_core_1.resolvePlugins)(allPlugins, chosenPlugins);
    argv = argv
        .strict()
        .help(true)
        .alias("h", "help")
        .options({
        dryRun: {
            alias: "dry",
            type: "boolean",
            description: "Perform a dry-run: check status, describe changes without changing anything",
            default: false,
        },
    });
    // Let plugins hook into the CLI options
    for (const plugin of plugins) {
        if (typeof plugin.defineCLIOptions === "function") {
            argv = plugin.defineCLIOptions(argv);
        }
    }
    parsedArgv = (await argv.parseAsync());
    const data = new Map();
    const context = {
        cwd: process.cwd(),
        cli: undefined,
        sys: {
            exec: release_script_core_1.exec,
            execRaw: release_script_core_1.execRaw,
        },
        argv: parsedArgv,
        plugins,
        warnings: [],
        errors: [],
        getData: (key) => {
            if (!data.has(key)) {
                throw new release_script_core_1.ReleaseError(`A plugin tried to access non-existent data with key "${key}"`, true);
            }
            else {
                return data.get(key);
            }
        },
        hasData: (key) => data.has(key),
        setData: (key, value) => {
            data.set(key, value);
        },
    };
    context.cli = new CLI(context);
    try {
        // Initialize plugins
        for (const plugin of plugins) {
            await ((_a = plugin.init) === null || _a === void 0 ? void 0 : _a.call(plugin, context));
        }
        // Execute stages
        await (0, release_script_core_1.execute)(context);
        const numWarnings = context.warnings.length;
        const numErrors = context.errors.length;
        if (numErrors > 0) {
            let message = `Release did not complete. There ${numErrors + numWarnings !== 1 ? "were" : "was"} ${picocolors_1.default.red(`${numErrors} error${numErrors !== 1 ? "s" : ""}`)}`;
            if (numWarnings > 0) {
                message += ` and ${picocolors_1.default.yellow(`${numWarnings} warning${numWarnings !== 1 ? "s" : ""}`)}`;
            }
            message += "!";
            console.error();
            console.error(message);
            process.exit(1);
        }
    }
    catch (e) {
        if ((0, release_script_core_1.isReleaseError)(e)) {
            console.error(prependPrefix(context.cli.prefix, colorizeTextAndTags(`[FATAL] ${e.message.replace("ReleaseError: ", "")}`, picocolors_1.default.red, picocolors_1.default.bgRed)));
        }
        else {
            const msg = (_c = (_b = e.stack) !== null && _b !== void 0 ? _b : e.message) !== null && _c !== void 0 ? _c : String(e);
            console.error(prependPrefix(context.cli.prefix, colorizeTextAndTags(`[FATAL] ${msg}`, picocolors_1.default.red, picocolors_1.default.bgRed)));
        }
        process.exit((_d = e.code) !== null && _d !== void 0 ? _d : 1);
    }
}
exports.main = main;
void main();
//# sourceMappingURL=index.js.map