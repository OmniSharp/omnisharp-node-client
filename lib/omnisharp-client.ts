import { findCandidates as candidateFinder} from "./candidate-finder";
import {ClientV1} from './clients/client-v1';
import {ClientV2} from './clients/client-v2';
import {ObservationClientV1, CombinationClientV1} from './clients/composite-client-v1';
import {ObservationClientV2, CombinationClientV2} from './clients/composite-client-v2';
import * as enums from "./enums";
import * as interfaces from "./interfaces";

export interface IDriver extends interfaces.IDriver {}
export interface OmnisharpClientOptions extends interfaces.OmnisharpClientOptions {}
export interface OmnisharpClientStatus extends interfaces.OmnisharpClientStatus {}
export var Driver = enums.Driver;
export var DriverState = enums.DriverState;
export var findCandidates = candidateFinder;

export class OmnisharpClientV1 extends ClientV1 {}
export class OmnisharpClientV2 extends ClientV2 {}

export class OmnisharpObservationClientV1<T extends OmnisharpClientV1> extends ObservationClientV1<T> {}
export class OmnisharpCombinationClientV1<T extends OmnisharpClientV1> extends CombinationClientV1<T> {}

export class OmnisharpObservationClientV2<T extends OmnisharpClientV2> extends ObservationClientV2<T> {}
export class OmnisharpCombinationClientV2<T extends OmnisharpClientV2> extends CombinationClientV2<T> {}
