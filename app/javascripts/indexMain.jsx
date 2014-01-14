/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'indexpage/IndexPage',
        'indexpage/IndexPageRouter',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues',
        'main/models/EbookModel'

    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        IndexPage,
        IndexPageRouter,
        SeriesDetailPanelView,
        FilterNullValues,
        EbookModel
    ) {
        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                data : {
                    pos : 'index'
                },
                xhrFields: {
                   withCredentials: true
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var indexPageRouter = IndexPageRouter.getInstance();

        var closeDetailPanel = function () {
            indexPageRouter.navigate('#index', {
                trigger : true
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <IndexPage />
                {seriesDetailPanelView}
            </div>
        ), document.body);

        indexPageRouter.on('route:detail', function (query) {
            seriesDetailPanelView.setState({
                show : true,
                loading : true
            });

            queryAsync(query).done(function (resp) {
                var ebookModle = new EbookModel(FilterNullValues.filterNullValues.call(FilterNullValues, resp));

                seriesDetailPanelView.setProps({
                    ebook : ebookModle
                });

                if (seriesDetailPanelView.isMounted()) {
                    seriesDetailPanelView.setState({
                        loading : false
                    });
                }
            });
        });

        indexPageRouter.on('route:index', function () {
            if (seriesDetailPanelView.isMounted()) {
                seriesDetailPanelView.setState({
                    show : false
                });
            }
        });

        Backbone.history.start();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });

    });
}(this, this.document));
