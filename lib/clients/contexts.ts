import {Observable} from "rx";
import {uniqueId, isObject, cloneDeep} from "lodash";
import {requestMutator, responseMutator} from "./response-handling";
var stripBom = require('strip-bom');

export class CommandContext<T> {
    constructor(public command: string, public value: T) { }
}

export class RequestContext<T> {
    public command: string;
    public request: T;
    public sequence: string;
    public time: Date;
    public silent: boolean;
    public oneBasedIndices: boolean;
    public isCommand(command: string) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    }

    constructor(public clientId, command: string, request: T, {silent, oneBasedIndices}: OmniSharp.RequestOptions, sequence = uniqueId("__request")) {
        if (command) this.command = command.toLowerCase();

        if (isObject(request)) {
            if (request['Buffer']) {
                request['Buffer'] = stripBom(request['Buffer']);
            }
            var obj = cloneDeep(request);
            if (!oneBasedIndices) {
                obj = requestMutator(obj);
            }
            this.request = Object.freeze(obj);
        } else {
            this.request = request;
        }

        this.silent = !!silent;
        this.sequence = sequence;
        this.time = new Date();
        Object.freeze(this);
    }

    public getResponse<TResponse>(stream: Observable<ResponseContext<T, TResponse>>) {
        return stream.first(res => res.sequence === this.sequence).map(z => z.response);
    }
}

export class ResponseContext<TRequest, TResponse> {
    public clientId: string;
    public request: TRequest;
    public response: TResponse;
    public command: string;
    public sequence: string;
    public time: Date;
    public responseTime: number;
    public silent: boolean;
    public isCommand(command: string) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    }

    constructor({clientId, request, command, sequence, time, silent, oneBasedIndices}: RequestContext<any>, response: TResponse) {
        if (command) this.command = command.toLowerCase();

        if (isObject(response)) {
            if (!oneBasedIndices) {
                response = responseMutator(response);
            }
            this.response = Object.freeze(response);
        } else {
            this.response = response;
        }

        this.clientId = clientId;
        this.request = request;
        this.command = command;
        this.sequence = sequence;
        this.time = new Date();
        this.silent = !!silent;
        this.responseTime = this.time.getTime() - time.getTime();
        Object.freeze(this);
    }
}
