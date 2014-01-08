/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'GA',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Wording,
        GA,
        DownloadHelper,
        ReadableSize,
        FormatString
    ) {

        var ElementsGenerator = {
            clickButtonDownload : function (source, video) {
                var installPlayerApp = this.refs !== undefined && this.refs['player-app'].state.checked;

                DownloadHelper.download(this.props.ebook.get('videoEpisodes'), installPlayerApp);

                if (this.props.subscribed !== -2) {
                    this.showSubscribeBubble('download_all', video);
                }

                // GA.log({
                //     'event' : 'video.download.action',
                //     'action' : 'btn_click',
                //     'pos' : source,
                //     'video_id' : this.props.ebook.id,
                //     'video_source' : this.props.ebook.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.ebook.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                //     'video_title' : this.props.ebook.get('title'),
                //     'video_type' : this.props.ebook.get('type'),
                //     'video_category' : this.props.ebook.get('categories'),
                //     'video_year' : this.props.ebook.get('year'),
                //     'video_area' : this.props.ebook.get('region')
                // });
            },
            getDownloadBtn : function (source) {
                return (
                    <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source, this.props.ebook.get('subscribeUrl'))}>
                        {Wording.READ}
                        <span className="size w-text-info bubble-download-tips w-wc">{Wording.DOWNLOAD_TIPS}</span>
                    </button>
                );
            },
            getPublishingEle : function () {
                var ebook = this.props.ebook;
                var text = ebook.get('finish') ? Wording.META_FINISHED : Wording.META_SERIES;

                return <div className="publishing w-text-primary w-wc">{FormatString(text, ebook.get('totalChaptersNum'))}</div>;
            },
            getMetaEle : function () {
                var ebook = this.props.ebook;
                var cate;

                if (!!ebook.get('subCategory')) {
                    cate = FormatString(Wording.META_CATE, ebook.get('category').name, ebook.get('subCategory').name);
                } else {
                    cate = FormatString(Wording.META_CATE_SINGLE, ebook.get('category').name);
                }

                var author = FormatString(Wording.META_AUTHOR, ebook.get('authors'));

                var source;
                var providers = ebook.get('providerNames');

                if (providers.length > 3) {
                    source = FormatString(Wording.META_SOURCE_MORE, providers.slice(0, 2).join('、'), providers.length);
                } else {
                    source = FormatString(Wording.META_SOURCE, providers.join('、'));
                }

                return <div className="w-text-secondary w-wc">{cate} · {author} · {source}</div>;
            }
        };

        return ElementsGenerator;
    });
}(this));
