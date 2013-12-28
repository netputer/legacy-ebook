/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'utilities/QueryString',
        'FormatCategories'
    ], function (
        React,
        IO,
        Actions,
        QueryString,
        FormatCategories
    ) {


        var queryCategory = QueryString.get('category') || '';

        var ItemView = React.createClass({
            renderSubCategories : function (categories) {
                console.log(categories)
                return _.map(categories, function (category, index) {
                    if (index === 0) {
                        return <dt key={index}><a href={'cate.html?category=' + category}>{category}</a></dt>;
                    } else {
                        return <dd key={index}><a href={'cate.html?category=' + category}>{category}</a></dd>;
                    }
                });
            },
            render : function () {
                var categories = this.props.categories;
                return (
                    <dl>
                        {this.renderSubCategories(categories)}
                    </dl>
                );
            }
        });


        var NavigationView = React.createClass({
            getInitialState : function () {
                return {
                    categories : []
                }
            },
            componentWillMount : function () {
                FormatCategories('subCategories', queryCategory).done(function (resp) {
                    this.setState({
                        categories : resp
                    });
                }.bind(this));
            },
            renderItem : function () {
                if (this.state.categories !== undefined) {
                    return _.map (this.state.categories, function (subCategories) {
                        return (
                            <li>
                                <ItemView categories={subCategories} />
                            </li>
                        );
                    }, this);
                }
            },
            render : function () {
                return (
                    <ul className="w-component-card navigation">
                        {this.renderItem()}
                    </ul>
                );
            }
        });

        return NavigationView;
    });
}(this));
