/// <reference path="typings/main/ambient/chai/index.d.ts" />
/// <reference path="typings/main/ambient/node/index.d.ts" />
/// <reference path="typings/main/definitions/lodash/index.d.ts" />
/// <reference path="node_modules/rx/ts/rx.all.es6.d.ts" />

declare module chai {
    interface Assert {
        isAbove(valueToCheck: number, valueToBeAbove: number, message?: string): void;
    }
}
