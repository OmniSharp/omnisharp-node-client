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
}

export var CompositeObservable = (function() {
    function addSubscription (source: Observable<any>, observers: ICompositeObserverItem[], item: ICompositeObserverItem) {
        var innerSubscription = new SingleAssignmentDisposable();
        var {group, observer} = item;
        group.add(innerSubscription);
        innerSubscription.setDisposable(
            source.subscribe(
                function (x) { observer.onNext(x); },
                function (e) { observer.onError(e); },
                function () {
                    group.remove(innerSubscription);
                    if (group.length === 0) {
                        observer.onCompleted();
                        _.pull(observers, item);
                        group.dispose();
                    }
                }
            )
        );

        return innerSubscription;
    }

    function add(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[], source: Observable<any>) {
        var current = _.find(sources, function(z) { return z.source === source});
        if (!current) {
            var s = {
                source: source,
                group: new CompositeDisposable(),
            };
            sources.push(s);

            _.each(observers, function(item) {
                s.group.add(addSubscription(s.source, observers, item));
            });
        }
    }

    function remove(sources: ICompositeSourceItem[], observers: ICompositeObserverItem[], source: Observable<any>) {
        var current = _.find(sources, function(z) { return z.source === source});
        if (current) {
            _.pull(sources, current);
            current.group.dispose();
        }
    }

    function Composite<T>(observables?: Observable<T>[]) {
        var sources: ICompositeSourceItem[] = []; // [{ source, group }]
        var observers: ICompositeObserverItem[] = []; // [{ observer, group, isStopped }]

        var observable = <any>Observable.create<T>(function (o) {
            var group = new CompositeDisposable();
            var item = {observer: o, group: group, isStopped: false};

            observers.push(item);

            _.each(sources, function(s) {
                s.group.add(addSubscription(s.source, observers, item));
            });
            return group;
        });
        observable.sources = sources;
        observable.observers = observers;
        observable.add = _.bind(add, observable, sources, observers);
        observable.remove = _.bind(remove, observable, sources, observers);
        _.each(observables || [], function(o) { observable.add(o) });

        return <ICompositeObservable<T>> observable;
    };

    return Composite;
})();
