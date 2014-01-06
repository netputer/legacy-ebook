/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording'
    ], function (
        React,
        IO,
        Actions,
        Wording
    ) {


        var ItemView = React.createClass({
            renderSubCategories : function () {
                var categories = this.props.category.subCategories;
                return _.map(categories, function (category, index) {
                    return <li key={index}><a href={'cate.html?category=' + category.name}>{category.name}</a></li>;
                }, this);
            },
            render : function () {
                var category = this.props.category;
                var cateUrl = 'cate.html?category=' + this.props.alias;

                return (
                    <nav className="nav-cate">
                        <a href={cateUrl} className="cate-title w-text-primary">{category !== undefined ? category.name : ''}</a>
                        <ul>
                            {category !== undefined ? this.renderSubCategories() : ''}
                        </ul>
                    </nav>
                );
            }
        });


        var NavigationView = React.createClass({
            render : function () {
                return (
                    <div className="w-component-card navigation">
                         <ItemView category={this.props.categories[0]} alias="novel" />
                         <ItemView category={this.props.categories[1]} alias="girl" />
                         <ItemView category={this.props.categories[2]} alias="published" />
                    </div>
                );
            }
        });

        return NavigationView;
    });
}(this));
