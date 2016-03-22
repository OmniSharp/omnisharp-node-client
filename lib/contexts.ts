import * as OmniSharp from "./omnisharp-server";
import {Observable} from "rxjs";
import {uniqueId, isObject, cloneDeep} from "lodash";
import {requestMutator, responseMutator} from "./response-handling";
import {createObservable} from "./operators/create";
const stripBom = require("strip-bom");

export class CommandContext<T> {
    constructor(public command: string, public value: T) { }
}

export class RequestContext<T extends OmniSharp.Models.Request> {
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

    constructor(public clientId: string, command: string, request: T, {silent, oneBasedIndices}: OmniSharp.RequestOptions, sequence = uniqueId("__request")) {
        if (command) this.command = command.toLowerCase();

        if (isObject(request)) {
            /* tslint:disable:no-string-literal */
            if (request.Buffer) {
                request.Buffer = stripBom(request.Buffer);
            }
            /* tslint:enable:no-string-literal */
            let obj = cloneDeep(request);
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
        return createObservable<TResponse>(observer =>
            stream.first(res => res.sequence === this.sequence).subscribe(res => {
                if (!res.failed) {
                    observer.next(res.response);
                    observer.complete();
                } else {
                    observer.complete();
                }
            }));
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
    public failed: boolean;
    public isCommand(command: string) {
        if (command && this.command) {
            return command.toLowerCase() === this.command;
        }
        return null;
    }

    constructor({clientId, request, command, sequence, time, silent, oneBasedIndices}: RequestContext<any>, response: TResponse = <any>{}, failed = false) {
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
        this.failed = !!failed;
        this.responseTime = this.time.getTime() - time.getTime();
        Object.freeze(this);
    }
}
