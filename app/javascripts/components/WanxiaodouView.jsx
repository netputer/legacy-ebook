/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Backbone,
        FormatString
    ) {

        var TYPE = {
            NO_RESULT : '没有找到关于「<em>{0}</em>」的电子书呢。',
            NO_EBOOK : '没有符合条件的电子书'
        };

        var WanxiaodouView = React.createClass({
            getDefaultProps : function () {
                return {
                    'data-tip' : ''
                };
            },
            render : function () {
                var index = _.random(0, 16);
                var className = 'wanxiaodou index' + index;
                var tip = this.props['data-tip'];
                var type = this.props['data-type'];

                tip = FormatString(TYPE[type], [tip]);

                return (
                    <div className="o-wanxiaodou-container">
                        <div className={className}></div>
                        <span className="wanxiaodou-tip w-text-info" dangerouslySetInnerHTML={{__html : tip}}></span>
                    </div>
                );
            }
        });

        return WanxiaodouView;
    });
}(this));
