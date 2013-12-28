/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'GA',
        'utilities/ReadableSize',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Wording,
        GA,
        ReadableSize,
        FormatString
    ) {

        var ElementsGenerator = {
            clickButtonDownload : function (source, video) {
                var installPlayerApp = this.refs !== undefined && this.refs['player-app'].state.checked;

                DownloadHelper.download(this.props.video.get('videoEpisodes'), installPlayerApp);

                if (this.props.subscribed !== -2) {
                    this.showSubscribeBubble('download_all', video);
                }

                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : source,
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                    'video_title' : this.props.video.get('title'),
                    'video_type' : this.props.video.get('type'),
                    'video_category' : this.props.video.get('categories'),
                    'video_year' : this.props.video.get('year'),
                    'video_area' : this.props.video.get('region')
                });
            },
            getCateEle : function () {
                var text = '';
                var data = this.props.video.toJSON();
                switch (this.props.video.get('type')) {
                case 'VARIETY':
                    text = data.categories;
                    break;
                case 'TV':
                case 'MOVIE':
                case 'COMIC':
                    text = data.categories + ' / ' + FormatString(Wording.YEAR, data.year);
                    break;
                }

                return <div className="w-text-secondary w-wc">{text}</div>;
            },
            getRatingEle : function () {
                var ele;
                var data = this.props.video.toJSON();
                if (data.rating !== Wording.NO_RATING) {
                    ele = <span className="h4">{data.rating}</span>;
                } else {
                    ele = data.rating;
                }

                return <div className="w-text-secondary w-wc">{Wording.RATING_LABEL}{ele}</div>;
            }
        };

        return ElementsGenerator;
    });
}(this));
