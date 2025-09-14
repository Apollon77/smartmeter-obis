/**
 * Errors thrown in this release script are of this type. The `code` property identifies what went wrong.
 */
export declare class ReleaseError extends Error {
    readonly message: string;
    /** Whether this is a fatal error */
    readonly fatal?: boolean | undefined;
    readonly exitCode?: number | undefined;
    constructor(message: string, 
    /** Whether this is a fatal error */
    fatal?: boolean | undefined, exitCode?: number | undefined);
}
export declare function isReleaseError(e: unknown): e is ReleaseError;
//# sourceMappingURL=error.d.ts.map