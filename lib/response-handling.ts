import {isArray, each, keys, filter, isNumber, has, get, set} from "lodash";

export var serverLineNumbers = [
    'Line', 'Column',
    'StartLine', 'StartColumn',
    'EndLine', 'EndColumn',
    'SelectionStartColumn', 'SelectionStartLine',
    'SelectionEndColumn', 'SelectionEndLine',
    'Selection.Start.Line', 'Selection.Start.Column',
    'Selection.End.Line', 'Selection.End.Column',
    'Location.Line', 'Location.Column',
    'Location.EndLine', 'Location.EndColumn',
];

export var serverLineNumberArrays = [
    'Lines'
];

export function requestMutator(data: any) {
    if (isArray(data)) {
        each(data, item => requestMutator(item));
        return data;
    }

    each(serverLineNumbers, path => {
        var hasPath = has(data, path);
        if (hasPath) {
            var value = get<number>(data, path);
            value = value + 1;
            set(data, path, value);
        }
    });

    each(serverLineNumberArrays, path => {
        var hasPath = has(data, path);
        if (hasPath) {
            var value = get<number[]>(data, path);
            for (var i = 0; i < value.length; i++) {
                value[i] = value[i] + 1;
            }
            set(data, path, value);
        }
    });

    each(filter(data, z => isArray(z)), (item: any[]) => requestMutator(item));

    return data;
}

export function responseMutator(data: any) {
    if (isArray(data)) {
        each(data, item => responseMutator(item));
        return data;
    }

    each(serverLineNumbers, path => {
        var hasPath = has(data, path);
        if (hasPath) {
            var value = get<number>(data, path);
            value = value - 1;
            set(data, path, value);
        }
    });

    each(serverLineNumberArrays, path => {
        var hasPath = has(data, path);
        if (hasPath) {
            var value = get<number[]>(data, path);
            for (var i = 0; i < value.length; i++) {
                value[i] = value[i] + 1;
            }
            set(data, path, value);
        }
    });

    each(filter(data, z => isArray(z)), (item: any[]) => responseMutator(item));

    return data;
}
