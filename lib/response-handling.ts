import {isArray, each, filter, has, get, set} from 'lodash';

export const serverLineNumbers = [
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

export const serverLineNumberArrays = [
    'Lines'
];

export function requestMutator(data: any) {
    if (isArray(data)) {
        each(data, item => requestMutator(item));
        return data;
    }

    each(serverLineNumbers, path => {
        const hasPath = has(data, path);
        if (hasPath) {
            let value = get<number>(data, path);
            value = value + 1;
            set(data, path, value);
        }
    });

    each(serverLineNumberArrays, path => {
        const hasPath = has(data, path);
        if (hasPath) {
            const value = get<number[]>(data, path);
            for (let i = 0; i < value.length; i++) {
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
        const hasPath = has(data, path);
        if (hasPath) {
            let value = get<number>(data, path);
            value = value - 1;
            set(data, path, value);
        }
    });

    each(serverLineNumberArrays, path => {
        const hasPath = has(data, path);
        if (hasPath) {
            const value = get<number[]>(data, path);
            for (let i = 0; i < value.length; i++) {
                value[i] = value[i] + 1;
            }
            set(data, path, value);
        }
    });

    each(filter(data, z => isArray(z)), (item: any[]) => responseMutator(item));

    return data;
}
