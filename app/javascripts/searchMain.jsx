/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'searchpage/SearchPage',
        'searchpage/SearchPageRouter',
        'main/models/EbookModel',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        SearchPage,
        SearchPageRouter,
        EbookModel,
        SeriesDetailPanelView,
        FilterNullValues
    ) {

        var searchPageRouter = SearchPageRouter.getInstance();

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
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
        
            searchPageRouter.navigate(window.location.hash.split('#')[0], {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <SearchPage />
                {seriesDetailPanelView}
            </div>
        ), document.body);


        searchPageRouter.on('route:search', function (query, id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true,
                    subscribed : -2
                });

                queryAsync(id).done(function (resp) {
                    var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, resp));

                    seriesDetailPanelView.setProps({
                        video : videoModle
                    });

                    if (seriesDetailPanelView.isMounted()) {
                        seriesDetailPanelView.setState({
                            loading : false
                        });
                    }
                });

                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'detail_view',
                    'video_id' : id,
                    'pos' : 'search'
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
