/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'mixins/BubbleView',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        BubbleView,
        GA
    ) {
        var DownloadBubbleView = React.createClass({
            mixins : [BubbleView],
            render : function () {
                var className = this.props.show ? ('bubble bubble-download show') : ('bubble bubble-download');
                return (
                    <div className={className}>
                        {Wording.DOWNLOAD_TIPS}
                    </div>
                );
            }
        });

        return DownloadBubbleView;
    });
}(this));
