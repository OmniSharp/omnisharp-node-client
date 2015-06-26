/// <reference path="omnisharp-server.d.ts" />
/// <reference path="node_modules/rx/ts/rx.all.d.ts" />
/// <reference path="lib/es6.d.ts" />
/// <reference path="lib/interfaces.d.ts" />
/// <reference path="typings/chai/chai.d.ts" />
/// <reference path="typings/lodash/lodash.d.ts" />
/// <reference path="typings/node/node.d.ts" />

declare module chai {
    interface Assert {
        isAbove(valueToCheck: number, valueToBeAbove: number, message?: string);
    }
}

declare module Rx {
    interface Observable<T> {
        throttleFirst(windowDuration: number, scheduler?: Rx.Scheduler): Observable<T>;
    }
}

declare module _ {
    interface LoDashStatic {
        set: any;
    }
}
