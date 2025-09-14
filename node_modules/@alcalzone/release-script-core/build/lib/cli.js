"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripColors = void 0;
// Shamelessly copied from https://github.com/chalk/ansi-regex
const ansiRegex = (() => {
    const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
    ].join("|");
    return new RegExp(pattern, "g");
})();
function stripColors(str) {
    return str.replace(ansiRegex, "");
}
exports.stripColors = stripColors;
//# sourceMappingURL=cli.js.map