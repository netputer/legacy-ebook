/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var TopPageRouter = Backbone.Router.extend({
            routes : {
                'detail/:id' : 'filter'
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
