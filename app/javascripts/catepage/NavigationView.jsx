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
                return _.map(categories, function (category, index) {
                    if (index === 0) {
                        return <th key={index}><a href={'cate.html?category=' + category}>{category}</a></th>;
                    } else {
                        return <td key={index}><a href={'cate.html?category=' + category}>{category}</a></td>;
                    }
                });
            },
            render : function () {
                var categories = this.props.categories;
                return (
                    <tr>
                        {this.renderSubCategories(categories)}
                    </tr>
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
            renderItem : function (from) {
                var categories = this.state.categories;
                if (categories !== undefined) {
                    return _.map (categories, function (subCategories, index) {
                        if (index >= from  &&  index < from + Math.floor(categories.length / 2)) {
                            return (
                                <ItemView categories={subCategories} />
                            );
                        }
                    }, this);
                }
            },
            render : function () {
                return (
                    <table className="w-component-card navigation">
                        <tbody>
                            {this.renderItem(0)}
                        </tbody>
                        <tbody>
                            {this.renderItem(Math.floor(this.state.categories.length / 2))}
                        </tbody>
                        <tbody>
                            {this.renderItem(this.state.categories.length - 1)}
                        </tbody>
                    </table>
                );
            }
        });

        return NavigationView;
    });
}(this));
