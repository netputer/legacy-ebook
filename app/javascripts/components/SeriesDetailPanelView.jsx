/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '$',
        '_',
        'Wording',
        'components/SeriesHeaderView',
        'components/DescriptionView',
        'components/LoadingView'
    ], function (
        React,
        $,
        _,
        Wording,
        SeriesHeaderView,
        DescriptionView,
        LoadingView
    ) {
        var SeriesDetailPanelView = React.createClass({
            getInitialState : function () {
                return {
                    show : false
                };
            },
            componentDidMount : function () {
                $(window).on('resize', _.throttle(function () {
                    $(this.refs.ctn.getDOMNode()).css({
                        height : window.innerHeight
                    });
                }.bind(this), 50));
            },
            clickCtn : function (evt) {
                if (evt.nativeEvent.srcElement.contains(this.refs.ctn.getDOMNode())) {
                    this.props.closeDetailPanel();
                }
            },
            render : function () {
                $('body').toggleClass('overflow', this.state.show);

                var style = {
                    height : window.innerHeight
                };

                var className = this.state.show ? 'o-series-panel show' : 'o-series-panel';

                var ebook = this.props.ebook;

                if (ebook) {
                    if (!this.state.loading) {
                        return (
                            <div className={className} style={style} onClick={this.clickCtn} ref="ctn">
                                <div className="o-series-panel-content w-vbox">
                                    <SeriesHeaderView ebook={ebook} />
                                    <div className="body-ctn">
                                        <DescriptionView ebook={ebook} />
                                    </div>
                                    <div className="o-close" onClick={this.props.closeDetailPanel} />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className={className}
                                style={style}
                                onClick={this.clickCtn}
                                ref="ctn">
                                <LoadingView />
                            </div>
                        );
                    }
                } else {
                    return (
                        <div className={className}
                            style={style}
                            onClick={this.clickCtn}
                            ref="ctn">
                        </div>
                    );
                }
            }
        });

        return SeriesDetailPanelView;

    });
}(this));
