import { findCandidates as candidateFinder} from "./candidate-finder";
import {ServerClient} from './clients/server-client';
import {CompositeClient} from './clients/composite-client';
import * as enums from "./enums";
import * as interfaces from "./interfaces";

export interface IDriver extends interfaces.IDriver {}
export interface OmnisharpClientOptions extends interfaces.OmnisharpClientOptions {}
export interface OmnisharpClientStatus extends interfaces.OmnisharpClientStatus {}
export var Driver = enums.Driver;
export var DriverState = enums.DriverState;
export var findCandidates = candidateFinder;
export class OmnisharpClient extends ServerClient {}
export class OmnisharpCompositeClient extends CompositeClient {}
