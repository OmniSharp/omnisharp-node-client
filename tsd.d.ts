/// <reference path="omnisharp-server.d.ts" />
/// <reference path="lib/interfaces.d.ts" />
/// <reference path="typings/chai/chai.d.ts" />
/// <reference path="typings/lodash/lodash.d.ts" />
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/chai/chai.d.ts" />
/// <reference path="typings/lodash/lodash.d.ts" />
/// <reference path="typings/mocha/mocha.d.ts" />
/// <reference path="typings/node/node.d.ts" />

declare module chai {
    interface Assert {
        isAbove(valueToCheck: number, valueToBeAbove: number, message?: string): void;
    }
}

declare module _ {
    interface LoDashStatic {
        set: any;
    }
}
