import {RequestContext} from "../contexts";
import {each} from "lodash";

var normalCommands = [
    'findimplementations', 'findsymbols', 'findusages',
    'gotodefinition', 'typelookup', 'navigateup',
    'navigatedown', 'getcodeactions', 'filesChanged',
    'runcodeaction', 'autocomplete', 'signatureHelp'
];
var priorityCommands = [
    'updatebuffer', 'changebuffer', 'formatAfterKeystroke'
];

var prioritySet = new Set<string>();
var normalSet = new Set<string>();
var deferredSet = new Set<string>();
var undeferredSet = new Set<string>();

each(normalCommands, x => {
    normalSet.add(x);
    undeferredSet.add(x);
});

each(priorityCommands, x => {
    prioritySet.add(x);
    undeferredSet.add(x);
});

export function isPriorityCommand(request: RequestContext<any>) {
    return prioritySet.has(request.command)
};

export function isNormalCommand(request: RequestContext<any>) {
    return !isDeferredCommand(request) && normalSet.has(request.command);
}

export function isDeferredCommand(request: RequestContext<any>) {
    if (request.silent && !isPriorityCommand(request)) {
        return true;
    }

    if (deferredSet.has(request.command)) {
        return true;
    }

    if (undeferredSet.has(request.command)) {
        return false;
    }

    deferredSet.add(request.command);
    return true;
}
