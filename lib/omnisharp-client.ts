import {ClientV1} from './clients/client-v1';
import {ClientV2} from './clients/client-v2';
export var clients = { ClientV1, ClientV2 };

import {ObservationClientV1, AggregateClientV1} from './aggregate/composite-client-v1';
import {ObservationClientV2, AggregateClientV2} from './aggregate/composite-client-v2';
export var aggregates = { ObservationClientV1, AggregateClientV1, ObservationClientV2, AggregateClientV2 };

import {ProxyManager} from "./proxy/proxy-manager";
import {ProxyClientV1} from "./proxy/proxy-client-v1";
import {ProxyClientV2} from "./proxy/proxy-client-v2";
export var proxies = { ProxyManager, ProxyClientV1, ProxyClientV2 };

export {findCandidates} from "./candidate-finder";
export {Driver, DriverState} from "./enums";
export {IDriver, OmnisharpClientOptions, OmnisharpClientStatus} from "./interfaces";
