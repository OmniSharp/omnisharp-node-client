import {Observable, AsyncSubject} from "rx";

function toObservable(eventName: string) {
    var parent = this;
    return Observable.create(function(observer) {
        var handler = o => observer.onNext(o);
        parent.addListener(eventName, handler);
        return () => parent.removeListener(eventName, handler);
    }).share();
};

export function observe<T>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Rx.Observable<T>>) {
    descriptor.get = function() { return (this[propertyKey] = this.__toObservable(propertyKey)); }
};

export function sync<T>(syncWith: () => Observable<T>) {
	return function sync(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
		var key = `__$${propertyKey}$__`;
		descriptor.get = function() {
			if (!this[key]) {
				this._disposable.add(syncWith.bind(this)().subscribe(v => this[propertyKey] = v));
                this[key] = true;
			}
		}
	}
}

export function proxy(returnResult: boolean = true) {
    return function request(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        descriptor.value = function(...args: any[]) {
            var response = new AsyncSubject<any>();
            var handler = (method: string, result: any) => {
                if (propertyKey === method) {
                    response.onNext(result);
                    response.onCompleted();
                    this._process.removeListener('__request', handler);
                }
            };

            this._process.emit('__request', propertyKey, ...args);
            this._process.on('__request', handler);

            if (returnResult)
                return response;
        }
    }
}
