import {OmnisharpClientOptions} from "../interfaces";

export const requestKey = '__$request$__';
export const clientKey = '__$client$__';
export const observeKey = '__$observe$__';

export interface Message {
    type: string;
    client: string;
}
export interface ExecuteMethodRequestMessage extends Message {
    method: string;
    args?: any[];
}
export interface ExecuteMethodResponseMessage extends Message {
    method: string;
    result: any;
}
export interface ObservationMessage extends Message {
    event: string;
    result: any;
}
export interface ObservationRequest extends Message {
    event: string;
    dispose?: boolean;
}
export interface ClientRequest extends Message {
    version: number;
    options: OmnisharpClientOptions;
    dispose?: boolean;
}
