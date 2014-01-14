/*global define*/
(function (window) {
    'use strict';

    define([], function () {
        var Actions = {
            actions : {
                EBOOK_DOWNLOAD : 'wdj://book/download.json',
                OFFLINE_READ : 'http://ebooks.wandoujia.com/api/v1/offlineRead',
                DOWNLOAD_LOG : 'http://ebooks.wandoujia.com/api/v1/offlineReadLog',

                CATEGORIES : 'http://ebooks.wandoujia.com/api/v1/categories',
                INDEX_CATEGORY : 'http://ebooks.wandoujia.com/api/v1/category/search/',

                SEARCH : 'http://ebooks.wandoujia.com/api/v1/search/',
                QUERY_SERIES : 'http://ebooks.wandoujia.com/api/v1/ebooks/',
                SUGGESTION : 'http://ebooks.wandoujia.com/api/v1/search/suggest/',
                HOT_QUERY : 'http://ebooks.wandoujia.com/api/v1/search/hotQueries',
                CATALOGUE : 'http://ebooks.wandoujia.com/api/v1/ebooks/{1}/catalogues',
                TRANSCODING : 'http://ebooks.wandoujia.com/api/v1/transcoding?chapterIds={1}'
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
