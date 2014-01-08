/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'GA',
        'utilities/FormatString',
        'mixins/ElementsGenerator'
    ], function (
        React,
        Wording,
        GA,
        FormatString,
        ElementsGenerator
    ) {

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
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
                                {this.getPublishingEle()}
                                {this.getMetaEle()}
                                <div className="download-info w-hbox">
                                    <div className="download-button">
                                        {this.getDownloadBtn('download_all')}
                                    </div>
                                    <div className="report"><a href="#">{Wording.REPORT}</a></div>
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
