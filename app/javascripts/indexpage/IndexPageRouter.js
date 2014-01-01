/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var IndexPageRouter = Backbone.Router.extend({
            routes : {
                'detail/:query' : 'detail',
                '*path' : 'index'
            }
        });

        var indexPageRouter;

        return {
            getInstance : function () {
                if (!indexPageRouter) {
                    indexPageRouter = new IndexPageRouter();
                }

                return indexPageRouter;
            }
        };
    });
}(this));
