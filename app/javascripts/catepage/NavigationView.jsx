/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'utilities/QueryString',
        'FormatCategoriesAsync'
    ], function (
        React,
        IO,
        Actions,
        QueryString,
        FormatCategoriesAsync
    ) {


        var queryCategory = QueryString.get('category') || '';

        var ItemView = React.createClass({
            renderSubCategories : function (categories) {
                return _.map(categories, function (category, index) {
                    if (index === 0) {
                        return <th key={index}><a className="w-text-secondary" href={'cate.html?category=' + category}>{category}</a></th>;
                    } else {
                        return <td key={index}><a className="w-text-thirdly" href={'cate.html?category=' + category}>{category}</a></td>;
                    }
                });
            },
            render : function () {
                var categories = this.props.categories;
                var style = (categories.length-1) > 5 ? 'multi-row' : 'single-row';
                return (
                    <tr className={style}>
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
                FormatCategoriesAsync('subCategories', queryCategory).done(function (resp) {
                    var source = this.props.source;

                    if (source === 'novel') {
                        resp[resp.length] = resp[4];
                        resp.splice(4, 1);

                        var arr = resp.slice(9, 12);
                        arr.sort(function (a, b) { return a.length - b.length; })[0];

                        resp.splice.apply(resp, [9, 3].concat(arr));

                    }

                    if (source === 'girl') {
                        var tmp;
                        tmp = resp[4];
                        resp[4] = resp[1];
                        resp[1] = resp[3];
                        resp[3] = tmp;
                    }

                    this.setState({
                        categories : resp
                    });

                    this.props.loaded();
                }.bind(this));
            },
            renderItem : function (from) {
                var categories = this.state.categories;
                if (categories !== undefined) {
                    return _.map (categories, function (subCategories, index) {
                        if (index >= from  &&  index < from + Math.floor(categories.length / 2)) {
                            return (
                                <ItemView key={index} categories={subCategories} />
                            );
                        }
                    }, this);
                }
            },
            render : function () {
                var cate = this.props.source !== undefined ? 'w-component-card navigation cate-' + this.props.source : '';
                return (
                    <table className={cate}>
                        <tbody>
                            {this.renderItem(0)}
                        </tbody>
                        <tbody>
                            {this.renderItem(Math.floor(this.state.categories.length / 2))}
                        </tbody>
                        <tbody className="full-column">
                            {this.renderItem(this.state.categories.length - 1)}
                        </tbody>
                    </table>
                );
            }
        });

        return NavigationView;
    });
}(this));
