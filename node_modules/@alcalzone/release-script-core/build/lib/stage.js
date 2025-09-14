"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStages = void 0;
exports.DefaultStages = Object.freeze({
    check: {
        id: "check",
        continueOnError: false,
    },
    edit: {
        id: "edit",
        after: ["check"],
    },
    commit: {
        id: "commit",
        after: ["edit"],
    },
    push: {
        id: "push",
        after: ["commit"],
    },
    cleanup: {
        id: "cleanup",
        after: ["push"],
    },
});
//# sourceMappingURL=stage.js.map