/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'toppage/TopPage',
        'toppage/TopPageRouter',
        'main/models/EbookModel',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        TopPage,
        TopPageRouter,
        EbookModel,
        SeriesDetailPanelView,
        FilterNullValues
    ) {

        var topPageRouter = TopPageRouter.getInstance();

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                data : {
                    pos : 'top'
                },
                xhrFields: {
                   withCredentials: true
                },
                success : deferred.resolve,
                error : deferred.reject,
                cache : true,
                ifModified : false,
            });

            return deferred.promise();
        };

        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });
        
            topPageRouter.navigate('keep', {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <TopPage />
                {seriesDetailPanelView}
            </div>
        ), document.body);

        topPageRouter.on('route:filter', function (id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true,
                    subscribed : -2
                });

                queryAsync(id).done(function (resp) {
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

            } else {
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
