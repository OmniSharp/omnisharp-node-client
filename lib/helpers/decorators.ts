import * as OmniSharp from "../omnisharp-server";
import _ from "lodash";
import {Subject, Observable} from "rxjs";
import {ResponseContext} from "../contexts";

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

export function response(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const internalKey = `__${propertyKey}__`;
    descriptor.get = function() {
        if (!this[internalKey]) {
            const instance = this._client || this;
            const stream: Subject<ResponseContext<any, any>> = instance._getResponseStream(propertyKey);
            this[internalKey] = stream.asObservable()
                .filter(x => !x.silent)
                .share();
        }

        return this[internalKey];
    };
    descriptor.enumerable = true;
}

export function event(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const internalKey = `__${propertyKey}__`;
    const eventKey = propertyKey[0].toUpperCase() + propertyKey.substr(1);
    descriptor.get = function() {
        if (!this[internalKey]) {
            const instance = this._client || this;
            this[internalKey] = (<Observable<OmniSharp.Stdio.Protocol.EventPacket>>instance._eventsStream)
                .filter(x => x.Event === eventKey)
                .share();
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

