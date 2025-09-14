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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStages = exports.resolvePlugins = exports.execute = exports.stripColors = void 0;
var cli_1 = require("./lib/cli");
Object.defineProperty(exports, "stripColors", { enumerable: true, get: function () { return cli_1.stripColors; } });
__exportStar(require("./lib/error"), exports);
__exportStar(require("./lib/exec"), exports);
var planner_1 = require("./lib/planner");
Object.defineProperty(exports, "execute", { enumerable: true, get: function () { return planner_1.execute; } });
Object.defineProperty(exports, "resolvePlugins", { enumerable: true, get: function () { return planner_1.resolvePlugins; } });
var stage_1 = require("./lib/stage");
Object.defineProperty(exports, "DefaultStages", { enumerable: true, get: function () { return stage_1.DefaultStages; } });
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map