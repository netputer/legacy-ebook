(function (window) {
    define([
        'Backbone',
        '_',
        'utilities/FormatString',
        'utilities/FormatDate',
        'Wording'
    ], function (
        Backbone,
        _,
        FormatString,
        FormatDate,
        Wording
    ) {

        var EbookModel = Backbone.Model.extend({
            defaults : {
                cover : {
                    l : [],
                    s : []
                },
                providerNames : []
            },
            pretreatData : function () {
                var data = this.toJSON();

                if (data.authors.length) {
                    data.authors = data.authors.join(' / ');
                } else {
                    data.authors = Wording.NO_DATA;
                }

                if (data.rating !== 0) {
                    data.rating = data.marketRatings[0].rating;
                } else {
                    data.rating = Wording.NO_RATING;
                }

                if (!data.category) {
                    data.category = Wording.NO_DATA;
                }

                if (data.description) {
                    data.description = data.description.trim();
                }

                this.set(data);
            },
            initialize : function () {
                this.pretreatData();
            }
        });

        return EbookModel;
    });
}(this));
