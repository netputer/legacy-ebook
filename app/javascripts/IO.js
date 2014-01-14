/*global define*/
(function (window) {
    define([
        'Backbone',
        '$',
        '_',
        'MessageRouterMixin',
        'BackendSocket'
    ], function (
        Backbone,
        $,
        _,
        MessageRouterMixin,
        BackendSocket
    ) {
        var IO = _.extend({}, Backbone.Events);

        MessageRouterMixin.mixin(IO);

        IO.Backend = _.extend({}, Backbone.Events);

        MessageRouterMixin.mixin(IO.Backend);

        IO.Backend.socket = new BackendSocket('wdjs://window/events');

        IO.Backend.socket.onmessage = function (message) {
            IO.Backend.trigger('message', message);
        };

        IO.Backend.requestAsync = function (url, options) {
            var deferred = $.Deferred();

            if (typeof url !== 'string') {
                options = url;
                url = options.url;
            }

            var originalURL = url;

            options = options || {};
            options.type = options.type || 'get';
            options.data = options.data || {};

            var done = function (resp) {
                resp = JSON.parse(resp);
                resp.state_line = resp.state_line || resp.state_code;

                if (typeof options.success === 'function') {
                    options.success.call(window, resp);
                }

                deferred.resolve(resp);
            };

            switch (options.type.toLowerCase()) {
            case 'get':
                var datas = [];
                var d;
                for (d in options.data) {
                    if (options.data.hasOwnProperty(d)) {
                        datas.push(d + '=' + window.encodeURIComponent(options.data[d]));
                    }
                }

                if (datas.length > 0) {
                    url = url + '?' + datas.join('&');
                }
                window.OneRingRequest(options.type, url, null, done);
                break;
            case 'post':
                window.OneRingRequest(options.type, url, window.encodeURIComponent(JSON.stringify(options.data)), done);
                break;
            }

            return deferred.promise();
        };

        IO.Cloud = _.extend({}, Backbone.Events);

        MessageRouterMixin.mixin(IO.Cloud);

        IO.Cloud.requestAsync = $.ajax;

        /* these are short-cuts for Backend and Cloud */
        /* ajax will choose based on the protocol in URL */
        IO.requestAsync = function (url) {
            var testingUrl = typeof url === 'string' ? url : url.url;

            if (!/^wdj:/.test(testingUrl) && typeof url === 'object') {
                url.data = url.data || {};

                _.extend(url.data, {
                    f : 'windows',
                    pcid : '',
                    udid : window.udid || ''
                });
            }

            return (/^wdj:/.test(testingUrl)) ?
                    IO.Backend.requestAsync.apply(IO.Backend, arguments) :
                    IO.Cloud.requestAsync.apply(IO.Cloud, arguments);
        };

        /* global `onmessage` event will merge streams into one and append source property */
        IO.Backend.on('message', function (event) {
            IO.trigger('message', _.extend(event, { source : 'backend' }));
        });
        IO.Cloud.on('message', function (event) {
            IO.trigger('message', _.extend(event, { source : 'cloud' }));
        });

        // Override the sync API of Backbone.js
        if (Backbone && Backbone.sync) {
            var methodMap = {
                'create': 'POST',
                'update': 'PUT',
                'patch':  'PATCH',
                'delete': 'DELETE',
                'read':   'GET'
            };

            Backbone.sync = function (method, model, options) {
                var url = model.url;

                var params = {
                    url : model.url,
                    type : methodMap[method],
                    contentType : 'application/json',
                    data : model.data,
                    dataType : 'json',
                    processData : true,
                    success : options.success,
                    error : options.error,
                    xhrFields: model.xhrFields || {}
                };

                IO.requestAsync(url, params);
            };
        }

        IO.requestAsync('wdj://device/get_udid.json').done(function (resp) {
            window.udid = resp.body.value;
        });

        return IO;
    });
}(this));
