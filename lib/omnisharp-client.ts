import { findCandidates as candidateFinder} from "./candidate-finder";
import {ClientV1} from './clients/client-v1';
import {ClientV2} from './clients/client-v2';
import {ObservationClientV1, CombinationClientV1} from './clients/composite-client-v1';
import {ObservationClientV2, CombinationClientV2} from './clients/composite-client-v2';
import * as enums from "./enums";
import * as interfaces from "./interfaces";

export interface IDriver extends interfaces.IDriver { }
export interface OmnisharpClientOptions extends interfaces.OmnisharpClientOptions { }
export interface OmnisharpClientStatus extends interfaces.OmnisharpClientStatus { }
export var Driver = enums.Driver;
export var DriverState = enums.DriverState;
export var findCandidates = candidateFinder;

export class OmnisharpClientV1 extends ClientV1 { }
export class OmnisharpClientV2 extends ClientV2 { }

export class OmnisharpObservationClientV1<T extends OmnisharpClientV1> extends ObservationClientV1<T> { }
export class OmnisharpCombinationClientV1<T extends OmnisharpClientV1> extends CombinationClientV1<T> { }

export class OmnisharpObservationClientV2<T extends OmnisharpClientV2> extends ObservationClientV2<T> { }
export class OmnisharpCombinationClientV2<T extends OmnisharpClientV2> extends CombinationClientV2<T> { }

(function() {
    var Rx = require('rx');
    Rx.Observable.prototype.flatMapWithMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
        return new Rx.FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
    };
var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

    Rx.internals.inherits(FlatMapObservable, __super__);

    function FlatMapObservable(source, selector, resultSelector, thisArg) {
      this.resultSelector = Rx.helpers.isFunction(resultSelector) ? resultSelector : null;
      this.selector = Rx.internals.bindCallback(Rx.helpers.isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
      this.source = source;
      __super__.call(this);
    }

    FlatMapObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
    };

    Rx.internals.inherits(InnerObserver, Rx.internals.AbstractObserver);
    function InnerObserver(observer, selector, resultSelector, source) {
      this.i = 0;
      this.selector = selector;
      this.resultSelector = resultSelector;
      this.source = source;
      this.o = observer;
      Rx.internals.AbstractObserver.call(this);
    }

    InnerObserver.prototype._wrapResult = function(result, x, i) {
      return this.resultSelector ?
        result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
        result;
    };

    InnerObserver.prototype.next = function(x) {
      var i = this.i++;
      var result = Rx.internals.tryCatch(this.selector)(x, i, this.source);
      //if (result === errorObj) { return this.o.onError(result.e); }

      Rx.helpers.isPromise(result) && (result = Rx.Observable.fromPromise(result));
      (Rx.helpers.isArrayLike(result) || Rx.helpers.isIterable(result)) && (result = Rx.Observable.from(result));
      this.o.onNext(this._wrapResult(result, x, i));
    };

    InnerObserver.prototype.error = function(e) { this.o.onError(e); };

    InnerObserver.prototype.onCompleted = function() { this.o.onCompleted(); };

    return FlatMapObservable;

}(Rx.ObservableBase));
})();
