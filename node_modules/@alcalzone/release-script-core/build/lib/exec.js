"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.execRaw = void 0;
const execa_1 = __importDefault(require("execa"));
function execRaw(command, options) {
    return execa_1.default.command(command, options);
}
exports.execRaw = execRaw;
function exec(...args) {
    // @ts-expect-error IDK, this should work...
    return (0, execa_1.default)(...args);
}
exports.exec = exec;
//# sourceMappingURL=exec.js.map