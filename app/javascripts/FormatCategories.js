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
                                console.log(categories)
                                var tmpArr = [];
                                if (categories.subCategories.length) {
                                    tmpArr.push(categories.name);
                                    _.each(categories.subCategories, function (category) {
                                        tmpArr.push(category);
                                    });
                                    array.push(tmpArr);
                                    if (cate === 'novel') {
                                        console.log(array[4])
                                        // array.push(array[4]);
                                    }
                                    console.log(array)
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
