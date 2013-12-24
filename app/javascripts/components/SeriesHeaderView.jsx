/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'GA',
        'utilities/FormatString'
    ], function (
        React,
        Wording,
        GA,
        FormatString
    ) {

        var SeriesHeaderView = React.createClass({
            render : function () {
                var data = this.props.ebook.toJSON();
                var stillsBgStyle = {
                    'background-image' : 'url(' + (data.cover.s || "") + ')'
                };

                return (
                    <div className="o-series-panel-header w-hbox">
                        <div className="stills o-mask" style={stillsBgStyle}></div>
                        <div className="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div className="info w-vbox">
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return SeriesHeaderView;
    });
}(this));
