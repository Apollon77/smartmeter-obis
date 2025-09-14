/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
export declare function isObject<T>(it: T): it is {} extends T ? // Narrow the `{}` type to an unspecified object
T & Record<string | number | symbol, unknown> : unknown extends T ? // treat unknown like `{}`
T & Record<string | number | symbol, unknown> : T extends object ? T extends readonly unknown[] ? never : T extends (...args: any[]) => any ? never : T : never;
/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export declare function isArray<T>(it: T): it is T extends readonly unknown[] ? T : {} extends T ? T & unknown[] : never;
