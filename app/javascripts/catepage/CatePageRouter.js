/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var CatePageRouter = Backbone.Router.extend({
            routes : {
                'detail/:id' : 'filter'
            }
        });

        var catePageRouter;

        return {
            getInstance : function () {
                if (!catePageRouter) {
                    catePageRouter = new CatePageRouter();
                }

                return catePageRouter;
            }
        };
    });
}(this));
