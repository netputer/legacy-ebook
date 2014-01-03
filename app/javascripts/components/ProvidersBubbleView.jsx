/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'mixins/BubbleView',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        BubbleView,
        DownloadHelper,
        ReadableSize,
        GA
    ) {
        var ProvidersBubbleView = React.createClass({
            mixins : [BubbleView],
            downloadFromProvider : function (url) {
                var installPlayerApp = !!document.getElementById('install-app') && document.getElementById('install-app').checked;
                if (this.props.episode) {
                    var index = this.props.video.get('videoEpisodes').indexOf(this.props.episode);
                    DownloadHelper.downloadFromProvider(this.props.episode, url, installPlayerApp, index);
                } else {
                    DownloadHelper.downloadFromProvider(this.props.video.get('videoEpisodes')[0], url, installPlayerApp);
                }

                this.setState({
                    providersBubbleShow : false,
                    providerItemsBubbleShow : false
                });

                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : 'provider',
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                    'video_title' : this.props.video.get('title'),
                    'video_type' : this.props.video.get('type'),
                    'video_category' : this.props.video.get('categories'),
                    'video_year' : this.props.video.get('year'),
                    'video_area' : this.props.video.get('region')
                });
            },
            render : function () {
                var className = this.getBubbleClassName(this.props.id).toLowerCase();
                var urls;
                if (this.props.episode === undefined) {
                    urls = this.props.video.get('videoEpisodes')[0].downloadUrls;
                } else {
                    urls = this.props.episode.downloadUrls;
                }

                var items = _.map(urls, function (url, index) {
                        return <li key={index} onClick={this.downloadFromProvider.bind(this, url)}>来源: {url.providerName} <span className="provider-size">{ReadableSize(url.size)}</span></li>
                    }, this);

                return (
                    <div className={className}>
                        <ul>{items}</ul>
                    </div>
                );
            }
        });

        return ProvidersBubbleView;
    });
}(this));
