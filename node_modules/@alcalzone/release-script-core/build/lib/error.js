"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReleaseError = exports.ReleaseError = void 0;
/**
 * Errors thrown in this release script are of this type. The `code` property identifies what went wrong.
 */
class ReleaseError extends Error {
    constructor(message, 
    /** Whether this is a fatal error */
    fatal, exitCode) {
        super(message);
        this.message = message;
        this.fatal = fatal;
        this.exitCode = exitCode;
        // We need to set the prototype explicitly
        Object.setPrototypeOf(this, ReleaseError.prototype);
        Object.getPrototypeOf(this).name = "ReleaseError";
    }
}
exports.ReleaseError = ReleaseError;
function isReleaseError(e) {
    return e instanceof Error && Object.getPrototypeOf(e).name === "ReleaseError";
}
exports.isReleaseError = isReleaseError;
//# sourceMappingURL=error.js.map