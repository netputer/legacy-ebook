/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'GA',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'indexpage/NavigationView',
        'indexpage/CategoryListView',
        'components/FooterView'

    ], function (
        React,
        IO,
        Actions,
        Wording,
        GA,
        Performance,
        FilterNullValues,
        SearchBoxView,
        NavigationView,
        CategoryListView,
        FooterView
    ) {

        var subCategories = {};
        var categoriesCount = {};

        var getCategoryListAsync = function () {
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.CATEGORIES,
                data : {
                    pos : 'index'
                },
                xhrFields: {
                   withCredentials: true
                },
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();
        };

        var IndexPage = React.createClass({
            mixins : [Performance],
            getInitialState : function () {
                return {
                    categories : [],
                    subCategories : {},
                    categoriesCount : {}
                };
            },
            getCategoryList : function () {
                getCategoryListAsync().done(function (resp) {
                    this.loaded();
                    this.setState({
                        categories : resp
                    });

                    _.each(resp[0].subCategories, function (category, index) {
                        subCategories[category.name] = category.subCategories;
                        categoriesCount[category.name] = category.books;
                        if (index === resp[0].subCategories.length - 1) {
                            _.each(resp[1].subCategories, function (category) {
                                categoriesCount[category.name] = category.books;
                                subCategories[category.name] = category.subCategories;
                            });
                        }
                    });
                }.bind(this));

                this.setState({
                    subCategories : subCategories,
                    categoriesCount : categoriesCount
                });
            },
            componentWillMount : function () {
                this.initPerformance('index', 9);
                this.getCategoryList();
            },
            componentDidMount : function () {
                GA.log({
                    'event' : 'ebook.homepage.display'
                });
            },
            onSearchAction : function (query) {
                if (query.length) {
                    $('<a>').attr({
                        href : 'search.html#q/' + query
                    })[0].click();
                }
            },
            onEbookSelect : function (id) {
                this.setTimeStamp(new Date().getTime(), id);
                window.location.hash = '#detail/' + id;
            },
            clickBanner : function (cate, query) {
                $('<a>').attr({
                    href : 'cate.html?' + query + '#' + cate
                })[0].click();
            },
            render : function () {
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            loaded={this.loaded}
                            source="index" />
                        <NavigationView
                            categories={this.state.categories}
                            loaded={this.loaded} />
                        <CategoryListView
                            subCategories={this.state.subCategories}
                            count={this.state.categoriesCount}
                            onEbookSelect={this.onEbookSelect}
                            loaded={this.loaded} />
                        <FooterView />
                    </div>
                );
            }
        });

        return IndexPage;
    });
}(this));
