/** @jsx React.DOM */
(function (window) {
    define([
        'React'
    ], function (
        React
    ) {
        var DescriptionView = React.createClass({
            render : function () {
                return (
                    <div className="o-serires-description">
                        <h5>简介</h5>
                        <p className="description w-text-secondary">{this.props.ebook.get('description').trim()}</p>
                    </div>
                );
            }
        });

        return DescriptionView;
    });
}(this));
