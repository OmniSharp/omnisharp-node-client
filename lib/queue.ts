import {delay, each} from "lodash";
// Globally handle events over all stdio drivers
export var enqueue = (function() {
    var _queue : Function[] = [];
    var _queueFinished = true;
    // Fake RAF for environments that don't have it.
    var requestAnimationFrame : any = window && window.requestAnimationFrame || function (cb: Function): number { delay(cb, 33); return -1; }

    var _raf = () => requestAnimationFrame(() => _dequeue());

    function _dequeue() {
        var framesToFinish = Math.min(Math.ceil(_queue.length / 20), 5);
        var queue = _queue.splice(0, framesToFinish);

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
    }
})();
