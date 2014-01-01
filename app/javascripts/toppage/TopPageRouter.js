/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var TopPageRouter = Backbone.Router.extend({
            routes : {
                'detail/:id' : 'filter'
            },
            getRankType : function () {
                return window.location.hash.split('#')[1];
            }
        });

        var topPageRouter;

        return {
            getInstance : function () {
                if (!topPageRouter) {
                    topPageRouter = new TopPageRouter();
                }

                return topPageRouter;
            }
        };
    });
}(this));
