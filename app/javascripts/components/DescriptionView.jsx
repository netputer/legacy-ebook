/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'Wording'
    ], function (
        React,
        Wording
    ) {
        var DescriptionView = React.createClass({
            render : function () {
                return (
                    <div className="o-serires-description">
                        <h5>{Wording.DESCRIPTION}</h5>
                        <p className="description w-text-secondary">{this.props.ebook.get('description').trim()}</p>
                    </div>
                );
            }
        });

        return DescriptionView;
    });
}(this));
