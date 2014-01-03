/*global define*/
(function (window) {
    'use strict';

    define([], function () {
        var Actions = {
            actions : {
                CATEGORIES : 'http://ebooks.wandoujia.com/api/v1/categories',
                INDEX_CATEGORY : 'http://ebooks.wandoujia.com/api/v1/category/search/',

                SEARCH : 'http://ebooks.wandoujia.com/api/v1/search/',
                QUERY_SERIES : 'http://ebooks.wandoujia.com/api/v1/ebooks/',
                SUGGESTION : 'http://ebooks.wandoujia.com/api/v1/search/suggest/',
                HOT_QUERY : 'http://ebooks.wandoujia.com/api/v1/search/hotQueries'
            },
            events : {
            },
            enums : {
                source : 'windows'
            }
        };

        /* apply Object.freeze recursively to an object */
        var objectDeepFreeze = function (object) {
            Object.keys(object).forEach(function (key) {
                if (typeof object[key] === 'object') {
                    objectDeepFreeze(object[key]);
                }
            });
            Object.freeze(object);
            return object;
        };

        objectDeepFreeze(Actions);

        return Actions;
    });
}(this));
