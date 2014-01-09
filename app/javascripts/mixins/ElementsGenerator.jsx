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
            clickButtonDownload : function (source, ebook, evt) {
                var ele = evt.target;
                ele.innerHTML = Wording.DOWNLOADING;

                DownloadHelper.download(ebook, source);

                window.setTimeout(function () {
                    ele.innerHTML = Wording.READ;
                }, 5000);

                GA.log({
                    'event' : 'ebook.' + source + '.click',
                    'read' : 1
                });

            },
            toggleDownloadTip : function (flag) {
                this.setState({
                    downloadTip : !!flag
                });
            },
            getDownloadBtn : function (source) {
                return (
                    <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source, this.props.ebook)} onMouseEnter={this.toggleDownloadTip.bind(this, 1)} onMouseLeave={this.toggleDownloadTip.bind(this, 0)}>
                        {Wording.READ}
                    </button>
                );
            },
            getPublishingEle : function () {
                var ebook = this.props.ebook;

                if (ebook !== undefined && ebook.get('finish')) {
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
                    <span className="w-text-secondary">{FormatString(Wording.META_COUNT, ebook !== undefined ? ebook.get('totalChaptersNum') : 0)}</span>
                );
            },
            getCateEle : function () {
                var ebook = this.props.ebook;
                var cate = ebook !== undefined ? ebook.get('category').name : '';

                if (ebook !== undefined && !!ebook.get('subCategory')) {
                    cate = cate + ' / ' + ebook.get('subCategory').name;
                }

                return (
                    <span className="w-text-secondary"><strong>{Wording.CATEGORY}：</strong>{cate}</span>
                );
            },
            getAuthorEle : function () {
                var ebook = this.props.ebook;

                return (
                    <span className="w-text-secondary"><strong>{Wording.AUTHOR}：</strong>{ebook !== undefined ? ebook.get('authors') : ''}</span>
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
