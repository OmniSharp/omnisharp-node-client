import {Observable, Subject, AsyncSubject, BehaviorSubject} from "rx";
import {IDriver, IStaticDriver, IDriverOptions} from "./interfaces";
import {assert} from "chai";
import {extend, uniqueId, some, endsWith, isObject, clone} from "lodash";
import { findCandidates as candidateFinder} from "./candidate-finder";
import {ServerClient} from './clients/server-client';
import {CompositeClient} from './clients/composite-client';


export var findCandidates = candidateFinder;
export var OmnisharpClient: typeof ServerClient = ServerClient;
export var OmnisharpCompositeClient: typeof CompositeClient = CompositeClient;
