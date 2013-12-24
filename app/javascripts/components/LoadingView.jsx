
/** @jsx React.DOM */
(function (window) {
    define([
        'React'
    ], function (
        React
    ) {
        var LoadingView = React.createClass({
            render : function () {
                var className = this.props.fixed ? 'w-ui-loading fixed' : 'w-ui-loading';
                return (
                    <div className={className}>
                        <div className="anima">
                            <div className="rotor rotor1"></div>
                            <div className="rotor rotor2"></div>
                            <div className="rotor rotor3"></div>
                            <div className="rotor rotor4"></div>
                            <div className="rotor rotor5"></div>
                            <div className="rotor rotor6"></div>
                            <div className="rotor rotor7"></div>
                            <div className="rotor rotor8"></div>
                        </div>
                    </div>
                );
            }
        });

        return LoadingView;
    });
}(this));
