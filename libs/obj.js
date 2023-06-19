
const objs = {
    apps: [],
    objs: []
};

/**
* Base object class
* (all user classes should be derived from this)
*/
class AppObject
{
    constructor()
    {
        _bind_methods(this);
        objs.objs.push(this);
    }
}

/** @typedef {false|'sync'|'async'} StartOption */

/**
 * Base App class
 * (all apps should be derived from this)
 */
class App extends AppObject
{
    /** @param {StartOption} start */
    constructor(start = 'async')
    {
        super();
        objs.apps.push(this);

        /** @type {{start:StartOption}} */
        this._options = { start };
        /** @type {() => void} */
        this._onLoad = null;

        if (start) this._start(start);
    }

    /** @param {StartOption} type */
    _start(type)
    {
        if (type == 'sync') this._onStart();
        else if (type == 'async') setTimeout(() => this._onStart());
        else throw new Error(`unsupported start mode '${type}'`);
    }

    _onStart()
    {
        /** @type {import('./core')} */
        const Core = global.Core;
        if (this.onStart) this.onStart();
        if (typeof Core != 'undefined') Core._load();
    }

    setOnLoad(cb) { this._onLoad = this._onLoad; }

    onStart() { }
    onLoad() { }
    onExit() { }
}


//Configure class methods to maintain 'this' context.
function _bind_methods(ctx)
{
    var meths = Object.getOwnPropertyNames(Object.getPrototypeOf(ctx))
    for (var m in meths)
    {
        var f = ctx[meths[m]];

        //For pure JS callbacks.
        ctx[meths[m]] = f.bind(ctx);

        //For DS callbacks.
        f._ctx = ctx;
        f._nohash = true;
    }
}
