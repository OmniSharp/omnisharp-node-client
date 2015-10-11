import * as _ from "lodash";

export function isNotNull(method: Function) {
    return function isNotNull(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        var value = descriptor.value;
        descriptor.value = function(request) {
            var result = method(request);
            if (result === null || result === undefined) {
                var methodText = method.toString().match(/function \(request\) { return (.*?); }/)[1] || method.toString();
                var errorText = `${methodText}  must not be null.`;
                throw new Error(errorText);
            }
            return value.apply(this, arguments);
        };
    }
}

export function isAboveZero(method: Function) {
    return function isAboveZero(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        var value = descriptor.value;
        descriptor.value = function(request) {
            var minValue = (this._options.oneBasedIndices ? 1 : 0) - 1;
            var result = method(request);
            if (result === null || result === undefined) {
                return;
            }
            if (result <= minValue) {
                var methodText = method.toString().match(/function \(request\) { return (.*?); }/)[1] || method.toString();
                var errorText = `${methodText} must be greater than or equal to ${minValue + 1}.`;
                throw new Error(errorText);
            }
            return value.apply(this, arguments);
        };
    }
}

export function precondition(method: Function, ...decorators: MethodDecorator[]) {
    return function precondition(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        var originalValue = descriptor.value;
        var methods = _.map(decorators, decorator => {
            descriptor.value = _.noop;
            decorator(target, propertyKey, descriptor)
            return descriptor.value;
        });

        descriptor.value = function(request) {
            if (method(request)) {
                methods.forEach(method => method.call(this, request));
            }
            return originalValue.apply(this, arguments);
        }
    }
}

export function endpoint(version: number = 1) {
    var format = (name) => name;
    if (version > 1) {
        format = (name) => `v${version}/${name}`;
    }
    return function endpoint(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        var name = format(propertyKey);
        descriptor.value = function(request, options) {
            return this.request(name, request, options);
        }
    }
}

export function watchCommand(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    var commandKey = propertyKey.substr('observe'.length);
    commandKey = commandKey[0].toLowerCase() + commandKey.substr(1);
    descriptor.get = function() { return (this[propertyKey] = this.watchCommand(commandKey)); }
}

export function watchEvent(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    var eventKey = propertyKey[0].toUpperCase() + propertyKey.substr(1);
    descriptor.get = function() { return (this[propertyKey] = this.watchEvent(eventKey)); }
}

export function inheritProperties(source: any, dest: any) {
    _.each(_.keys(source.prototype), key => {
        var descriptor = Object.getOwnPropertyDescriptor(source.prototype, key);
        var isDefined = !!_.has(dest.prototype, key);
        if (descriptor && !isDefined) {
            if (_.has(descriptor, 'value') || _.has(descriptor, 'writable')) {
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
