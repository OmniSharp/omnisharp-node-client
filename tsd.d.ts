/// <reference path="typings/main/ambient/chai/chai.d.ts" />
/// <reference path="typings/main/ambient/node/node.d.ts" />
/// <reference path="typings/main/definitions/lodash/lodash.d.ts" />
/// <reference path="node_modules/rx/ts/rx.all.es6.d.ts" />

declare module chai {
    interface Assert {
        isAbove(valueToCheck: number, valueToBeAbove: number, message?: string): void;
    }
}
