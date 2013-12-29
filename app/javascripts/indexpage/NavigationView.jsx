/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions'
    ], function (
        React,
        IO,
        Actions
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
                return (
                    <nav className="nav-cate">
                        <a href="" className="cate-title w-text-primary">{category !== undefined ? category.name : ''}</a>
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
                         <ItemView category={this.props.categories[0]} />
                         <ItemView category={this.props.categories[1]} />
                        <div className="nav-cate">
                            <a href="" className="cate-title w-text-primary">排行榜</a>
                            <ul>
                                <li><a href="top.html#weeek_hot">周榜</a></li>
                                <li><a href="top.html#month_hot">月榜</a></li>
                                <li><a href="top.html#history_hot">总榜</a></li>
                            </ul>
                        </div>
                    </div>
                );
            }
        });

        return NavigationView;
    });
}(this));
