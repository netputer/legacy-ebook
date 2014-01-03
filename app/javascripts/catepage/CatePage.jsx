/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'mixins/FilterNullValues',
        'utilities/QueryString',
        'components/searchbox/SearchBoxView',
        'FormatCategories',
        'components/ResultListView',
        'components/PaginationView',
        'components/FilterView',
        'catepage/CatePageRouter',
        'catepage/NavigationView',
        'collections/ResultListCollection',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        FilterNullValues,
        QueryString,
        SearchBoxView,
        FormatCategories,
        ResultListView,
        PaginationView,
        FilterView,
        CatePageRouter,
        NavigationView,
        ResultListCollection,
        FooterView
    ) {


        var PAGE_SIZE = 10;

        var queryCategory = QueryString.get('category') || '';

        var queryWords = '';
        var queryUpdate = '';
        var queryRankType = '';

        var categoryPageRouter = CatePageRouter.getInstance();

        var queryAsync = function (category, page) {
            var deferred = $.Deferred();
            page = Math.max((page || 0) - 1, 0);

            var finished = category === 'finished' || QueryString.get('category') === 'finished' ? false : '';
            var cate = category === 'finished' ? '' : category;

            if (queryUpdate === 'finished') {
                finished = false;
                queryUpdate = '';
            }

            if (category === Wording.CATE_GIRL) {
                cate = Wording.DEFAULT_GIRL;
            }

            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    categories : cate,
                    subscribe : finished,
                    rank_type : queryRankType,
                    words : queryWords,
                    update : queryUpdate,
                    start : page * PAGE_SIZE,
                    max : PAGE_SIZE,
                    pos : 'w/category'
                },
                success : function (resp) {
                    window.sessionId = resp.sessionId;
                    deferred.resolve(resp);
                },
                error : deferred.reject
            });

            return deferred.promise();
        };

        var resultListCollection = new ResultListCollection();

        var CategoryPage = React.createClass({
            mixins : [FilterNullValues],
            getInitialState : function () {
                return {
                    categories : [],
                    subCategories : [],
                    result : [],
                    loading : false,
                    currentPage : 1,
                    pageTotal : 0,
                    correctQuery : '',
                    total : 0,
                    filterSelected : {
                        category : queryCategory,
                        words : queryWords,
                        update : queryUpdate,
                        rank : queryRankType
                    },
                    loaded : false
                }
            },
            queryAsync : function (queryCategory, page) {
                var deferred = $.Deferred();

                var cate = queryCategory;

                if (queryCategory === 'novel' || queryCategory === 'girl') {
                    cate = Wording['DEFAULT_' + queryCategory.toUpperCase()];
                }

                queryAsync(cate, page).done(function (resp) {
                    resp = this.filterNullValues(resp);
                    resp.total = resp.total > 200 ? 200 : resp.total;
                    resultListCollection.reset(resp.result);
                    this.setState({
                        result : resp.result,
                        loading : false,
                        pageTotal : Math.round(resp.total / PAGE_SIZE),
                        currentPage : page || 1,
                        total : resp.total,
                        loaded : true
                    }, function () {
                        deferred.resolve();
                    });
                }.bind(this));

                return deferred.promise();
            },
            componentDidMount : function () {
                this.setState({
                    loading : true
                });

                if (queryCategory === 'finished') {
                    FormatCategories('categories', 'combined').done(function (resp) {
                        this.setState({
                            categories : resp
                        });
                    }.bind(this));
                 } else if (queryCategory !== 'novel' && queryCategory !== 'girl') {
                    FormatCategories('subCategories', queryCategory).done(function (resp) {
                        this.setState({
                            subCategories : resp
                        });
                    }.bind(this));
                }

                this.queryAsync(queryCategory, this.state.currentPage);
            },
            onSearchAction : function (query) {
                if (query.trim().length) {
                    $('<a>').attr({
                        href : 'search.html#q/' + query
                    })[0].click();
                }
            },
            onPaginationSelect : function (target) {
                this.queryAsync(queryCategory, target).done(function () {
                    this.refs['ebook-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            onEbookSelect : function (ebook) {
                categoryPageRouter.navigate('/detail/' + ebook.id, {
                    trigger : true
                });
            },
            onFilterSelect : function (prop, item) {
                switch (prop) {
                case 'category':
                    queryCategory = item;
                    break;
                case 'words':
                    queryWords = item;
                    break;
                case 'update':
                    queryUpdate = item;
                    break;
                case 'rank':
                    queryRankType = item;
                    break;
                }

                this.setState({
                    filterSelected : {
                        category : queryCategory,
                        words : queryWords,
                        update : queryUpdate,
                        rank : queryRankType,
                        currentPage : 1,
                        pageTotal : 0
                    }
                });
                this.queryAsync(queryCategory, this.state.currentPage);
            },
            render : function () {
                if (QueryString.get('category') === 'novel' || QueryString.get('category') === 'girl') {
                    return (
                        <div className="o-ctn">
                            <SearchBoxView
                                className="o-search-box-ctn"
                                onAction={this.onSearchAction}
                                source="search" />
                            <div>
                                <h4 className="cate-title">{Wording['CATE_' + queryCategory.toUpperCase()]}</h4>
                            </div>
                            <NavigationView source={QueryString.get('category')} />
                            <ResultListView
                                category={queryCategory}
                                list={this.state.result}
                                loading={this.state.loading}
                                total={this.state.total}
                                correctQuery={this.state.correctQuery}
                                onEbookSelect={this.onEbookSelect}
                                loaded={this.state.loaded}
                                ref="ebook-ctn" />
                            <PaginationView
                                total={this.state.pageTotal}
                                current={this.state.currentPage}
                                onSelect={this.onPaginationSelect} />
                            <FooterView />
                        </div>
                    );
                } else if (QueryString.get('category') === 'finished') {

                    return (
                        <div className="o-ctn">
                            <SearchBoxView
                                className="o-search-box-ctn"
                                onAction={this.onSearchAction}
                                source="search" />
                            <div>
                                <h4 className="cate-title">{Wording.CATE_FINISHED}</h4>
                            </div>
                            <FilterView
                                list={this.state.result}
                                categories={this.state.categories}
                                onFilterSelect={this.onFilterSelect}
                                filterSelected={this.state.filterSelected}
                                source="finished" />
                            <ResultListView
                                category={queryCategory}
                                list={this.state.result}
                                loading={this.state.loading}
                                total={this.state.total}
                                correctQuery={this.state.correctQuery}
                                onEbookSelect={this.onEbookSelect}
                                loaded={this.state.loaded}
                                ref="ebook-ctn" />
                            <PaginationView
                                total={this.state.pageTotal}
                                current={this.state.currentPage}
                                onSelect={this.onPaginationSelect} />
                            <FooterView />
                        </div>
                    );
                } else {
                    return (
                        <div className="o-ctn">
                            <SearchBoxView
                                className="o-search-box-ctn"
                                onAction={this.onSearchAction}
                                source="search" />
                            <div>
                                <a href={this.state.result.length && this.state.result[0].topCategory === Wording.CATE_GIRL ? 'cate.html?category=girl' : 'cate.html?category=novel'} className="w-text-secondary">全部{this.state.result.length ? this.state.result[0].topCategory : ''}分类 &gt;</a>
                                <h4 className="cate-title">{queryCategory}</h4>
                            </div>
                            <FilterView
                                list={this.state.result}
                                categories={this.state.subCategories}
                                onFilterSelect={this.onFilterSelect}
                                filterSelected={this.state.filterSelected}
                                source="category" />
                            <ResultListView
                                category={queryCategory}
                                list={this.state.result}
                                loading={this.state.loading}
                                total={this.state.total}
                                correctQuery={this.state.correctQuery}
                                onEbookSelect={this.onEbookSelect}
                                loaded={this.state.loaded}
                                ref="ebook-ctn" />
                            <PaginationView
                                total={this.state.pageTotal}
                                current={this.state.currentPage}
                                onSelect={this.onPaginationSelect} />
                            <FooterView />
                        </div>
                    );
                }
            }
        });

        return CategoryPage;
    });
}(this));
