import {IDisposable, Disposable, IDisposableOrSubscription} from "./Disposable";
export class CompositeDisposable implements IDisposable {
    private _disposables = new Set<IDisposableOrSubscription>();
    private _isDisposed = false;

    constructor(...disposables: IDisposableOrSubscription[]) {
        disposables.forEach((item: any) => this._disposables.add(item));
    }

    public get isDisposed() { return this._isDisposed; }

    public dispose() {
        this._isDisposed = true;
        if (this._disposables.size) {
            this._disposables.forEach(disposable => Disposable.of(disposable).dispose());
            this._disposables.clear();
        }
    }

    public add(...disposables: IDisposableOrSubscription[]) {
        if (this.isDisposed) {
            disposables.forEach((item: any) => Disposable.of(item).dispose());
        } else {
            disposables.forEach((item: any) => this._disposables.add(item));
        }
    }

    public remove(disposable: IDisposableOrSubscription) {
        return this._disposables.delete(disposable);
    }
}
