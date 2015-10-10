// TODO: Remove in next major bump. This is a back compatability issue :(
export {findCandidates} from "./candidate-finder";
import {findCandidates} from "./candidate-finder";
export var candidateFinder = findCandidates;
export {ClientV1 as OmnisharpClientV1} from './clients/client-v1';
export {ClientV2 as OmnisharpClientV2} from './clients/client-v2';
export {ObservationClientV1 as OmnisharpObservationClientV1, CombinationClientV1 as OmnisharpCombinationClientV1} from './clients/composite-client-v1';
export {ObservationClientV2 as OmnisharpObservationClientV2, CombinationClientV2 as OmnisharpCombinationClientV2} from './clients/composite-client-v2';
export {Driver, DriverState} from "./enums";
export {IDriver, OmnisharpClientOptions, OmnisharpClientStatus} from "./interfaces";
