/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'IO',
        'Wording'
    ], function (
        React,
        IO,
        Wording
    ) {
        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : 'http://ebooks.wandoujia.com/api/v1/transcoding?chapterIds=' + id,
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
