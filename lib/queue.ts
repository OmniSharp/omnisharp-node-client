import {delay, each} from 'lodash';
// Globally handle events over all stdio drivers
export const enqueue = (function() {
    let _queueFinished = true;
    const _queue : Function[] = [];
    // Fake RAF for environments that don't have it.
    const requestAnimationFrame : any = window && window.requestAnimationFrame || function (cb: Function): number { delay(cb, 33); return -1; };

    const _raf = () => requestAnimationFrame(() => _dequeue());

    function _dequeue() {
        const framesToFinish = Math.min(Math.ceil(_queue.length / 20), 5);
        const queue = _queue.splice(0, framesToFinish);

        each(queue, cb => cb());

        if (_queue.length) {
            _raf();
        } else {
            _queueFinished = true;
        }
    }

    return function _enqueue(cb: Function) {
        _queue.push(cb);

        if (_queueFinished) {
            _queueFinished = false;
            _raf();
        }
    };
})();
