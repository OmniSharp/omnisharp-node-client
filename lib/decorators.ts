import * as _ from "lodash";
(<any>_.memoize).Cache = Map;

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
    let value: any;
    descriptor.get = function() {
        if (!value) value = this.watchCommand(propertyKey);
        return value;
    };
    descriptor.enumerable = true;
}

export function watchEvent(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const eventKey = propertyKey[0].toUpperCase() + propertyKey.substr(1);
    let value: any;
    descriptor.get = function() {
        if (!value) value = this.watchEvent(eventKey);
        return value;
    };
    descriptor.enumerable = true;
}

export function merge(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const method = (c: any) => c.observe[propertyKey] || c[propertyKey];
    let value: any;
    descriptor.get = function() {
        if (!value) value = this.makeMergeObserable(method);
        return value;
    };
}

export function aggregate(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const method = (c: any) => c.observe[propertyKey] || c[propertyKey];
    let value: any;
    descriptor.get = function() {
        if (!value) value = this.makeAggregateObserable(method);
        return value;
    };
}

export function reference(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    descriptor.get = function() { return this._client[propertyKey]; };
}

export function inheritProperties(source: any, dest: any) {
    _.each(_.keys(source.prototype), key => {
        const descriptor = Object.getOwnPropertyDescriptor(source.prototype, key);
        const isDefined = !!_.has(dest.prototype, key);
        if (descriptor && !isDefined) {
            if (_.has(descriptor, "value") || _.has(descriptor, "writable")) {
                Object.defineProperty(dest.prototype, key, {
                    configurable: descriptor.configurable,
                    enumerable: descriptor.enumerable,
                    value: descriptor.value,
                    writable: descriptor.writable,
                });
            } else {
                Object.defineProperty(dest.prototype, key, {
                    configurable: descriptor.configurable,
                    enumerable: descriptor.enumerable,
                    get: descriptor.get,
                    set: descriptor.set
                });
            }
        }
    });
}
