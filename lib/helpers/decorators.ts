import * as OmniSharp from "../omnisharp-server";
import _ from "lodash";
import {Subject} from "rxjs";

export function isNotNull(method: Function) {
    return function isNotNull(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const value = descriptor.value;
        descriptor.value = function(request: OmniSharp.Models.Request) {
            const result = method(request);
            if (result === null || result === undefined) {
                const match = method.toString().match(/function \(request\) { return (.*?); }/);
                const methodText = match && match[1] || method.toString();
                const errorText = `${methodText}  must not be null.`;
                throw new Error(errorText);
            }
            return value.apply(this, arguments);
        };
    };
}

export function isAboveZero(method: Function) {
    return function isAboveZero(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const value = descriptor.value;
        descriptor.value = function(request: OmniSharp.Models.Request) {
            const minValue = (this._options.oneBasedIndices ? 1 : 0) - 1;
            const result = method(request);
            if (result === null || result === undefined) {
                return;
            }
            if (result <= minValue) {
                const match = method.toString().match(/function \(request\) { return (.*?); }/);
                const methodText = match && match[1] || method.toString();
                const errorText = `${methodText} must be greater than or equal to ${minValue + 1}.`;
                throw new Error(errorText);
            }
            return value.apply(this, arguments);
        };
    };
}

export function precondition(method: Function, ...decorators: MethodDecorator[]) {
    return function precondition(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const originalValue = descriptor.value;
        const methods = _.map(decorators, decorator => {
            descriptor.value = _.noop;
            decorator(target, propertyKey, descriptor);
            return descriptor.value;
        });

        descriptor.value = function(request: OmniSharp.Models.Request) {
            if (method(request)) {
                methods.forEach(m => m.call(this, request));
            }
            return originalValue.apply(this, arguments);
        };
    };
}

export function endpoint(version = 1) {
    let format = (name: string) => name;
    if (version > 1) {
        format = (name) => `v${version}/${name}`;
    }
    return function endpoint(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const name = format(propertyKey);
        descriptor.value = function(request: OmniSharp.Models.Request, options: any) {
            return this.request(name, request, options);
        };
        descriptor.enumerable = true;
    };
}

export function fixup(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const value = descriptor.value;
    descriptor.value = function(request: OmniSharp.Models.Request, options: any) {
        this._fixup(propertyKey, request, options);
        return value.apply(this, arguments);
    };
}

export function watchCommand(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const internalKey = `__${propertyKey}__`;
    descriptor.get = function() {
        const instance = this._client || this;
        if (!instance._commandWatchers.get(propertyKey)) {
            const subject = new Subject<any>();
            const observable = subject.share();

            instance._commandWatchers.set(propertyKey.toLowerCase(), [subject, observable]);
            this[internalKey] = observable;
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
}

export function watchEvent(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const internalKey = `__${propertyKey}__`;
    const eventKey = propertyKey[0].toUpperCase() + propertyKey.substr(1);
    descriptor.get = function() {
        const instance = this._client || this;
        if (!instance._eventWatchers.get(eventKey)) {
            const subject = new Subject<any>();
            const observable = subject.share();

            instance._eventWatchers.set(eventKey, [subject, observable]);
            this[internalKey] = observable;
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
}

export function merge(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const internalKey = `__${propertyKey}__`;
    const method = (c: any) => c.observe[propertyKey] || c[propertyKey];
    descriptor.get = function() {
        if (!this[internalKey]) {
            const value = this.makeMergeObserable(method);
            this[internalKey] = value;
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
}

export function aggregate(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const internalKey = `__${propertyKey}__`;
    const method = (c: any) => c.observe[propertyKey] || c[propertyKey];
    descriptor.get = function() {
        if (!this[internalKey]) {
            const value = this.makeAggregateObserable(method);
            this[internalKey] = value;
        }
        return this[internalKey];
    };
    descriptor.enumerable = true;
}

export function reference(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    descriptor.get = function() { return this._client[propertyKey]; };
}

