/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'IO',
        'Wording',
        'Actions',
        'utilities/FormatString'
    ], function (
        React,
        IO,
        Wording,
        Actions,
        FormatString
    ) {
        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : FormatString(Actions.actions.TRANSCODING, id),
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var PreviewView = React.createClass({
            getInitialState : function () {
                return {
                    content : ''
                };
            },
            componentWillReceiveProps : function (nextProps) {
                if (!!nextProps.firstId) {
                    queryAsync(nextProps.firstId).done(function (contents) {
                        this.setState({
                            content : contents[0].content
                        });
                    }.bind(this));
                }
            },
            render : function () {
                return (
                    <div className="o-serires-preview">
                        <h5>{Wording.PREVIEW}</h5>
                        <div class="preview">{this.state.content}</div>
                    </div>
                );
            }
        });

        return PreviewView;
    });
}(this));
