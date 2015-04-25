/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../tsd.d.ts" />


declare module chai {
    interface Assert {
        isAbove(valueToCheck: number, valueToBeAbove: number, message?: string);
    }
}
