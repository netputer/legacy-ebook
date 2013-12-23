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
        'main/models/VideoModel',
        'components/DownloadListView',
        'VideoPlayer'
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
        VideoModel,
        DownloadListView,
        VideoPlayer
    ) {
        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
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
                loading : true,
                subscribed : -2
            });

            queryAsync(query).done(function (resp) {
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
                'video_id' : query,
                'pos' : 'homepage'
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
                if (VideoPlayer.isShow) {
                    VideoPlayer.close();
                } else {
                    closeDetailPanel();
                }
            }
        });
    });
}(this, this.document));
