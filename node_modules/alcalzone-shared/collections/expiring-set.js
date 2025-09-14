"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiringSet = void 0;
const events_1 = require("events");
/**
 * A Set that automatically removes items after a certain time has elapsed since they were added
 */
class ExpiringSet extends events_1.EventEmitter {
    constructor(expiryTime, iterable) {
        super();
        this._timeouts = new Map();
        if (expiryTime < 1) {
            throw new Error("The expiry time must be a positive integer");
        }
        this.expiryTime = expiryTime;
        this._set = new Set(iterable);
        this._set.forEach(entry => this.queueForExpiry(entry));
    }
    queueForExpiry(entry) {
        // Clear old timeouts
        if (this._timeouts.has(entry)) {
            clearTimeout(this._timeouts.get(entry));
        }
        const newTimeout = setTimeout(() => {
            this._set.delete(entry);
            this._timeouts.delete(entry);
            this.emit("expired", entry);
        }, this.expiryTime).unref();
        this._timeouts.set(entry, newTimeout);
    }
    add(value) {
        this._set.add(value);
        this.queueForExpiry(value);
        return this;
    }
    clear() {
        this._set.clear();
        this._timeouts.forEach(timeout => clearTimeout(timeout));
        this._timeouts.clear();
    }
    delete(value) {
        const ret = this._set.delete(value);
        if (this._timeouts.has(value)) {
            clearTimeout(this._timeouts.get(value));
            this._timeouts.delete(value);
        }
        return ret;
    }
    forEach(callbackfn, thisArg) {
        this._set.forEach((v1, v2) => callbackfn(v1, v2, this), thisArg);
    }
    has(value) {
        return this._set.has(value);
    }
    get size() {
        return this._set.size;
    }
    /** Iterates over values in the set. */
    [Symbol.iterator]() {
        return this._set[Symbol.iterator]();
    }
    /**
     * Returns an iterable of [v,v] pairs for every value `v` in the set.
     */
    entries() {
        return this._set.entries();
    }
    /**
     * Despite its name, returns an iterable of the values in the set,
     */
    keys() {
        return this._set.keys();
    }
    /**
     * Returns an iterable of values in the set.
     */
    values() {
        return this._set.values();
    }
}
exports.ExpiringSet = ExpiringSet;
