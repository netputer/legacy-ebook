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
        'utilities/FormatString',
        'utilities/FormatWords',
        'utilities/FormatDate'
    ], function (
        React,
        _,
        Wording,
        GA,
        DownloadHelper,
        ReadableSize,
        FormatString,
        FormatWords,
        FormatDate
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

                if (ebook.get('finish')) {
                    return (
                        <span className="w-text-secondary">{Wording.FINISHED}</span>
                    );
                }

                return (
                    <span className="publishing w-text-primary"><strong>{Wording.SERIES}</strong></span>
                );
            },
            getWordsEle : function () {
                var ebook = this.props.ebook;

                return (
                    <span className="w-text-secondary">{FormatString(Wording.META_WORDS, FormatWords(ebook.get('words')))}</span>
                );
            },
            getUpdateEle : function () {
                var ebook = this.props.ebook;

                return (
                    <span className="w-text-secondary">{FormatString(Wording.META_UPDATE, FormatDate('kindly', ebook.get('updatedDate')))}</span>
                );
            },
            getCountEle : function () {
                var ebook = this.props.ebook;

                return (
                    <span className="w-text-secondary">{FormatString(Wording.META_COUNT, ebook.get('totalChaptersNum'))}</span>
                );
            },
            getCateEle : function () {
                var ebook = this.props.ebook;
                var cate = ebook.get('category').name;

                if (!!ebook.get('subCategory')) {
                    cate = cate + ' / ' + ebook.get('subCategory').name;
                }

                return (
                    <span className="w-text-secondary"><strong>{Wording.CATEGORY}：</strong>{cate}</span>
                );
            },
            getAuthorEle : function () {
                var ebook = this.props.ebook;

                return (
                    <span className="w-text-secondary"><strong>{Wording.AUTHOR}：</strong>{ebook.get('authors')}</span>
                );
            },
            getSourceEle : function () {
                var ebook = this.props.ebook;
                var source;
                var providers = ebook.get('providerNames');

                if (providers.length > 3) {
                    source = providers.slice(0, 2).join('、') + FormatString(Wording.META_SOURCE_MORE, providers.length);
                } else {
                    source = providers.join('、');
                }

                return (
                    <span className="w-text-secondary"><strong>{Wording.SOURCE}：</strong>{source}</span>
                );
            }
        };

        return ElementsGenerator;
    });
}(this));
