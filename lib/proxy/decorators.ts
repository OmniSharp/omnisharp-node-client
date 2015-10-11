import * as _ from "lodash";
import {Observable, AsyncSubject} from "rx";

export function observe<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Rx.Observable<T>>) {
    descriptor.get = function() { return (this[propertyKey] = this._proxy.observe(propertyKey)); }
};

export function sync<T>(syncWith: () => Observable<T>) {
    return function sync(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        var key = `__$${propertyKey}$__`;
        descriptor.get = function() {
            if (!this[key]) {
                this._disposable.add(syncWith.bind(this)().subscribe(v => {
                    this[propertyKey] = v;
                    delete this[key];
                }));

                this[key] = true;
            }
        }
    }
}

export function proxy(returnResult: boolean = true) {
    return function request(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        descriptor.value = function(...args: any[]) {
            var response = this._proxy.request(propertyKey, returnResult, ...args);

            if (returnResult)
                return response;
        }
    }
}

import {inheritProperties} from "../decorators";
export function proxyProperties(source: any, dest: any) {
    _.each(_.keys(source.prototype), key => {
        var descriptor = Object.getOwnPropertyDescriptor(source.prototype, key);
        var isDefined = !!_.has(dest.prototype, key);
        if (descriptor && !isDefined) {
            if (_.has(descriptor, 'get')) {
                Object.defineProperty(dest.prototype, key, {
                    configurable: descriptor.configurable,
                    enumerable: descriptor.enumerable,
                    get: function() { return (this[key] = this._proxy.observe(key)); }
                });
            }
        }
    });

    inheritProperties(source, dest);
}
