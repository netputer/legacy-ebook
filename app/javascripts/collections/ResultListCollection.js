/*global define*/
'use strict';
(function (window) {
    define([
        'Backbone',
        'main/models/EbookModel'
    ], function (
        Backbone,
        EbookModel
    ) {
        var ResultListCollection = Backbone.Collection.extend({
            model : EbookModel
        });

        return ResultListCollection;
    });
}(this));
