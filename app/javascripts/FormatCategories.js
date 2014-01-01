/*global define*/
(function (window) {
    'use strict';

    define([
        'React',
        'IO',
        'Actions'
    ], function (
        React,
        IO,
        Actions
    ) {
        var result;

        var getCategoryListAsync = function () {
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.CATEGORIES,
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();
        };

        var FormatCategories = function (type, cate) {
            return getCategoryListAsync().then(function (resp) {
                switch (type) {
                case 'subCategories' :
                    var array = [];

                    if (cate === 'novel' || cate === 'girl') {
                        var num = cate === 'novel' ? 0 : 1;
                        _.each(resp[num].subCategories, function (categories, idx) {
                                var tmpArr = [];
                                if (categories.subCategories.length) {
                                    tmpArr.push(categories.name);
                                    _.each(categories.subCategories, function (category) {
                                        tmpArr.push(category);
                                    });
                                    array.push(tmpArr);
                                    result = array;
                                    return;
                                }
                        });
                    }

                    _.each(resp, function (categories, idx) {
                        _.each(categories.subCategories, function (sc, index) {
                            if (sc.name === cate) {
                                array.push(sc.name);
                                _.each(sc.subCategories, function (category) {
                                    array.push(category);
                                });
                                result = array;
                                return;
                            } else {
                                _.each(sc.subCategories, function (category) {
                                    if (category === cate) {
                                        array.push(sc.name);
                                        array.push.apply(array, sc.subCategories);
                                        result = array;
                                        return;
                                    }
                                });
                            }
                        });
                    });

                    break;
                case 'categories' :
                    var array = [];
                    var num = cate === 'girl' ? 1 : 0;

                    _.each(resp[num].subCategories, function (categories, idx) {
                        array.push(categories.name);
                        return;
                    });

                    if (cate === 'combined') {
                        array[array.length - 1] = resp[1].name;
                    }

                    result = array;
                    return result;

                default :
                    result = resp;
                    break;

                }


                return result;
            });
        };

        return FormatCategories;


    });
}(this));
