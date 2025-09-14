/// <reference types="node" />
import { EventEmitter } from "events";
interface ExpiringSetEventCallbacks<T> {
    expired: (entry: T) => void;
}
declare type ExpiringSetEvents<T> = keyof ExpiringSetEventCallbacks<T>;
export interface ExpiringSet<T> {
    on<TEvent extends ExpiringSetEvents<T>>(event: TEvent, callback: ExpiringSetEventCallbacks<T>[TEvent]): this;
    removeListener<TEvent extends ExpiringSetEvents<T>>(event: TEvent, callback: ExpiringSetEventCallbacks<T>[TEvent]): this;
    removeAllListeners(event?: ExpiringSetEvents<T>): this;
}
/**
 * A Set that automatically removes items after a certain time has elapsed since they were added
 */
export declare class ExpiringSet<T> extends EventEmitter {
    private _set;
    private _timeouts;
    /**
     * The time in milliseconds each entry will last
     */
    readonly expiryTime: number;
    constructor(expiryTime: number, iterable?: Iterable<T> | null | undefined);
    private queueForExpiry;
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: ExpiringSet<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    get size(): number;
    /** Iterates over values in the set. */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    entries(): IterableIterator<[T, T]>;
    /**
     * Despite its name, returns an iterable of the values in the set,
     */
    keys(): IterableIterator<T>;
    /**
     * Returns an iterable of values in the set.
     */
    values(): IterableIterator<T>;
}
export {};
