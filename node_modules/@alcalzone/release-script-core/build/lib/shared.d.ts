import type { Context } from "./context";
export declare type ConstOrDynamic<T> = T | ((context: Context) => T | Promise<T>);
//# sourceMappingURL=shared.d.ts.map