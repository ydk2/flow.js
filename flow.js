var flow = (function () {

    function flow(values) {
        'use strict';
        if (!values) {
            return this;
        }
        
        this.xhr = null;
        this.values = values;
        var me = this;

        me.Events = function () {
            this.events = []; // Empty list of events/actions
        }

        me.Events.prototype.on = function (event, fn) {
            this.events[event] = this.events[event] || [];
            this.events[event].push(fn);
        }

        me.Events.prototype.off = function (event) {
            this.events[event] = [];
            delete this.events[event];
        }

        me.Events.prototype.fire = function (event, data) {
            if (this.events[event]) {
                this.events[event].forEach(function (fn) {
                    fn.apply(me, [event, data]);
                })
            }
        }

        me.Listener = new me.Events();
        me.timer = { start: 0, stop: 0, diff: 0 };

        me.result = false;

        me.then = function (success) {
            //var me = this;
            me.Listener.on('success', function (env, data) {
                //console.log('triggered');
                me.timer.stop = new Date().getTime();
                me.timer.diff = me.timer.stop - me.timer.start; //new Date().getTime();
                if (typeof success == 'function') {
                    success.apply(me, data);
                }
                me.Listener.off('reject');
                me.Listener.off('success');
                me.Listener.off('progress');
            });
            return me;
        };

        me.progress = function (progress) {
            me.Listener.on('progress', function (env, data) {

                me.timer.stop = new Date().getTime();
                me.timer.diff = me.timer.stop - me.timer.start;

                if (typeof progress == 'function') {
                    progress.apply(me, data);
                }
            });
            return me;
        };

        me.reject = function (reject) {
            me.Listener.on('reject', function (env, data) {

                me.timer.stop = new Date().getTime();
                me.timer.diff = me.timer.stop - me.timer.start;

                if (typeof reject == 'function') {
                    reject.apply(me, data);
                }
                me.Listener.off('reject');
                me.Listener.off('success');
                me.Listener.off('progress');
            });
            return me;
        };
        return me;
    };

    function buildQuery(json) {
        try {
            return '' +
                Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                        encodeURIComponent(json[key]);
                }).join('&');
        } catch (exp) {
            return '';
        }
    }

    function basename(path, suffix) {
        var b = path
        var lastChar = b.charAt(b.length - 1)
        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1)
        }
        b = b.replace(/^.*[/\\]/g, '')
        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
            b = b.substr(0, b.length - suffix.length)
        }
        return b
    }

    flow.prototype = {
        values: {
            method: 'POST',
            url: null,
            data: null,
            timeout: 2000,
            headers: 'x-flow-request'
        },
        timer: { start: 0, stop: 0, diff: 0 },
        header: function (headers) {
            if (headers !== null) {
                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        var value = headers[key];
                        if (this.xhr !== null) this.xhr.setRequestHeader(key, value);
                    }
                }
            }
        }
    };

    flow.prototype.progressing = { value: null, max: null };

    flow.prototype.ajax = function () {
        var me = this;

        try {

            var MSxhrA = new Array(
                "Msxml2.XMLHTTP.7.0",
                "Msxml2.XMLHTTP.6.0",
                "Msxml2.XMLHTTP.5.0",
                "Msxml2.XMLHTTP.4.0",
                "MSXML2.XMLHTTP.3.0",
                "MSXML2.XMLHTTP",
                "Microsoft.XMLHTTP"
            );
            if (window.XMLHttpRequest) {
                me.xhr = new XMLHttpRequest();
            } else {
                var s = false;
                for (var i = 0; i < MSxhrA.length && !s; i++) {
                    try {
                        me.xhr = new ActiveXObject(MSxhrA[i]);
                        s = true;
                    } catch (exp) {
                        me.Listener.fire('reject', [605, me.xhr.status, me.xhr]);
                        me.xhr = null;
                        return me;
                    }
                }
            }
            if (me.xhr !== null) {
                
                me.timer.start = new Date().getTime();
                me.xhr.open(me.values.method, me.values.url, true);                
                me.xhr.withCredentials = true;
                var content_type = 'application/x-www-form-urlencoded';
                me.xhr.setRequestHeader('Content-type', content_type);
                me.xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
                if (me.xhr.overrideMimeType) me.xhr.overrideMimeType('text/plain;charset=UTF-8');

                vars = (me.values.data == null) ? null : buildQuery(me.values.data);
                me.xhr.timeout = me.values.timeout;
                me.xhr.onreadystatechange = function () { onchange(me); };

                me.xhr.ontimeout = function (exp) {
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [408, me.xhr.status, me.xhr]);
                    me.xhr.abort();
                };

                me.xhr.onerror = function (exp) {
                    me.Listener.fire('reject', [604, me.xhr.status, me.xhr]);
                    me.xhr.abort();
                };

                setTimeout(function () {
                    if (me.values.method.toLowerCase() == "post") {
                        me.xhr.send(vars);
                    } else {
                        me.xhr.send();
                    }
                }, 10);
            }
        } catch (exp) {
            me.timer.stop = new Date().getTime();
            me.timer.diff = me.timer.stop - me.timer.start;
            me.Listener.fire('reject', [606, me.xhr.status, me.xhr]);
            me.xhr = null;
        }
        return me;
    };

    /**
     * CORS enable request
     * 
     * @returns 
     */
    flow.prototype.cors = function () {
        var me = this;
        try {
            try {
                me.xhr = new XMLHttpRequest(me.values.method, me.values.url);
                if ("withCredentials" in me.xhr) {
                    // Most browsers.
                    me.xhr.open(me.values.method, me.values.url, true);
                } else if (typeof XDomainRequest != "undefined") {
                    // IE8 & IE9
                    me.xhr = new XDomainRequest();
                    this.xhr.open(me.values.method, me.values.url);
                } else {
                    // CORS not supported.
                    me.Listener.fire('reject', [609, 0, me.xhr]);
                    me.xhr = null;
                }
            } catch (e) {
                me.Listener.fire('reject', [605, 0, me.xhr]);
                me.xhr = null;
            }

            if (me.xhr !== null) {

                me.timer.start = new Date().getTime();
                me.xhr.withCredentials = true;
                var content_type = 'application/x-www-form-urlencoded';
                me.xhr.setRequestHeader('Content-type', content_type);
                //me.xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
                if (me.xhr.overrideMimeType) me.xhr.overrideMimeType('text/plain;charset=UTF-8');

                vars = (me.values.data == null) ? null : buildQuery(me.values.data);
                me.xhr.timeout = me.values.timeout;
                me.xhr.onreadystatechange = function () { onchange(me); };

                me.xhr.ontimeout = function (exp) {
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [408, me.xhr.status, me.xhr]);
                    me.xhr.abort();
                };

                me.xhr.onerror = function (exp) {
                    me.Listener.fire('reject', [604, me.xhr.status, me.xhr]);
                    me.xhr.abort();
                };

                setTimeout(function () {
                    if (me.values.method.toLowerCase() == "post") {
                        me.xhr.send(vars);
                    } else {
                        me.xhr.send();
                    }
                }, 10);
            }
        } catch (exp) {
            me.timer.stop = new Date().getTime();
            me.timer.diff = me.timer.stop - me.timer.start;
            me.Listener.fire('reject', [606, me.xhr.status, me.xhr]);
            me.xhr = null;
        }
        return me;
    };

    var onchange = function (me) {
        if ([200, 301, 302, 303, 307].indexOf(me.xhr.status) > -1) {

            switch (me.xhr.readyState) {
                case 0: // UNINITIALIZED
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [604, me.xhr.status, me.xhr]);
                    break;
                case 1: // LOADING
                    me.Listener.fire('progress', [me.xhr.status, me.xhr]);
                case 2: // LOADED
                    me.Listener.fire('progress', [me.xhr.status, me.xhr]);
                case 3: // INTERACTIVE
                    me.Listener.fire('progress', [me.xhr.status, me.xhr]);
                    break;
                case 4: // COMPLETED
                    var response = me.xhr.responseText;
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('success', [response, me.xhr.status, me.xhr]);
                    break;
                default:
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [601, me.xhr.status, me.xhr]);
            };
        } else {
            switch (me.xhr.readyState) {
                case 0: // UNINITIALIZED
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [604, me.xhr.status, me.xhr]);
                    break;
                case 1: // LOADING
                    me.Listener.fire('progress', [me.xhr.status, me.xhr]);
                case 2: // LOADED
                    me.Listener.fire('progress', [me.xhr.status, me.xhr]);
                case 3: // INTERACTIVE
                    me.Listener.fire('progress', [me.xhr.status, me.xhr]);
                    break;
                case 4: // COMPLETED
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [me.xhr.status, me.xhr.status, me.xhr]);
                    break;
                default:
                    me.timer.stop = new Date().getTime();
                    me.timer.diff = me.timer.stop - me.timer.start;
                    me.Listener.fire('reject', [601, me.xhr.status, me.xhr]);
            };
        }
    };


    flow.prototype.buildQuery = buildQuery;

    /**
     * @param {String} Url 
     * @returns {JSON Object}
     */
    flow.prototype.getQuery = function (url) {

        var pieces = {};
        pieces = url.split('?');
        if (pieces.hasOwnProperty(1)) {
            return pieces[1];
        }
        return null;
    };

    /**
     * @param {String} UrlQuery 
     * @returns {JSON Object}
     */
    flow.prototype.parseQuery = function (UrlQuery) {
        var json = {};
        var pieces = {};
        pieces = UrlQuery.split('&');
        for (var i in pieces) {
            if (pieces.hasOwnProperty(i)) {
                var item = pieces[i].split('=');
                json[item[0]] = (item[1] != undefined) ? item[1] : null;
            }
        }
        return json;
    };

    flow.prototype.noCache = function (s) {
        if (s == null) {
            s = '?';
        }
        return s + "nocache=" + new Date().getTime();
    };

    flow.prototype.online = function () {
        return navigator.onLine ? true : false;
    };

    if (typeof (y) != "undefined") {
        y.prototype.flow = flow;
        y.fn.flow = flow;
    }
    if (typeof (include) == "function") {
        include.prototype.fn.flow = flow;
    }

    if (typeof define === 'function' && define.amd) {
        /* AMD support */
        define(function () {
            return flow;
        });
    } else {
        return flow;
    }

})();
