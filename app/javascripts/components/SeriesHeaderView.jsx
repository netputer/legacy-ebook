/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'GA',
        'mixins/ElementsGenerator',
        'components/DownloadBubbleView'

    ], function (
        React,
        Wording,
        GA,
        ElementsGenerator,
        DownloadBubbleView
    ) {

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    downloadTip : false
                };
            },
            render : function () {
                var data = this.props.ebook.toJSON();
                var stillsBgStyle = {
                    'background-image' : 'url(' + (data.cover.l || '') + ')'
                };
                return (
                    <div className="o-series-panel-header w-hbox">
                        <div className="stills o-mask" style={stillsBgStyle}></div>
                        <div className="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div className="info w-vbox">
                                <div className="w-wc">
                                    {this.getPublishingEle()}
                                    <span> / </span>
                                    {this.getWordsEle()}
                                    <span> / </span>
                                    {this.getUpdateEle()}
                                    <span> / </span>
                                    {this.getCountEle()}
                                </div>
                                <div className="w-wc">
                                    {this.getCateEle()}
                                    <span> / </span>
                                    {this.getAuthorEle()}
                                    <span> / </span>
                                    {this.getSourceEle()}
                                </div>
                                <div className="download-info w-hbox">
                                    <div className="download-button">
                                        {this.getDownloadBtn('detail')}
                                        <DownloadBubbleView show={this.state.downloadTip} />                                    </div>
                                    <div className="report"><a href="http://m.wandoujia.com/book_legal.html" target="_default">{Wording.REPORT}</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return SeriesHeaderView;
    });
}(this));
