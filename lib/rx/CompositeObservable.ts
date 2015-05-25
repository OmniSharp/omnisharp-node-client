import {each, bind, pull, find, partial} from "lodash";
import {CompositeDisposable, SingleAssignmentDisposable, Observable} from "rx";

interface ICompositeObserverItem {
    group: CompositeDisposable;
    observer: Rx.Observer<any>;
}
interface ICompositeSourceItem {
    group: CompositeDisposable;
    source: Observable<any>;
}

export interface ICompositeObservable<T> extends Observable<T> {
    add(observable: Observable<T>);
    remove(observable: Observable<T>);
    removeAll();
    reset();
}

export var CompositeObservable = (function() {
    function addSubscription(source: Observable<any>, observers: ICompositeObserverItem[], item: ICompositeObserverItem) {
        var innerSubscription = new SingleAssignmentDisposable();
        var {group, observer} = item;
        group.add(innerSubscription);
        innerSubscription.setDisposable(
            source.subscribe(
                function(x) { observer.onNext(x); },
                function(e) { observer.onError(e); },
                function() {
                    group.remove(innerSubscription);
                    //if (group.length === 0) {
                        //observer.onCompleted();
                        //pull(observers, item);
                        //group.dispose();
                    //}
                }
                )
            );

        return innerSubscription;
    }

    function add(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[], source: Observable<any>) {
        var current = find(sources, function(z) { return z.source === source });
        if (!current) {
            var s = {
                source: source,
                group: new CompositeDisposable(),
            };
            sources.push(s);

            each(observers, function(item) {
                s.group.add(addSubscription(s.source, observers, item));
            });
        }
    }

    function remove(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[], source: Observable<any>) {
        var current = find(sources, function(z) { return z.source === source });
        if (current) {
            pull(sources, current);
            current.group.dispose();
        }
    }

    function removeAll(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[]) {
        each(sources, this.remove);
    }

    function create(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[], o) {
        var group = new CompositeDisposable();
        var item = { observer: o, group: group, isStopped: false };

        observers.push(item);

        each(sources, function(s) {
            s.group.add(addSubscription(s.source, observers, item));
        });
        return group;
    }

    function reset(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[]) {
        var observables = sources.map(z => z.source);
        this.removeAll();
        each(observables, (o) => this.add(o));
    }

    function Composite<T>(observables?: Observable<T>[]) {
        var sources: ICompositeSourceItem[] = []; // [{ source, group }]
        var observers: ICompositeObserverItem[] = []; // [{ observer, group, isStopped }]

        var observable = <any>Observable.create<T>(<any>partial(create, sources, observers));
        observable.sources = sources;
        observable.observers = observers;
        observable.add = bind(add, observable, sources, observers);
        observable.remove = bind(remove, observable, sources, observers);
        observable.removeAll = bind(removeAll, observable, sources, observers);
        observable.reset = bind(reset, observable, sources, observers);
        each(observables || [], function(o) { observable.add(o) });

        return <ICompositeObservable<T>> observable;
    };

    return Composite;
})();
