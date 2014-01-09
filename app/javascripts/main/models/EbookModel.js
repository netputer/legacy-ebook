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
                providerNames : []
            },
            pretreatData : function () {
                var data = this.toJSON();

                data.showTitle = data.title.replace(/<\/?em>/g, '');

                if (data.authors) {
                    data.authors = data.authors.join(' / ');
                } else {
                    data.authors = Wording.NO_DATA;
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
