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
        'searchpage/SearchPageRouter',
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
        SearchPageRouter,
        ResultListCollection,
        FooterView
    ) {


        var PAGE_SIZE = 10;

        var queryCategory = QueryString.get('category') || '';

        var queryType;
        var queryYearText;
        var queryRankType = 'rel';

        var searchPageRouter = SearchPageRouter.getInstance();

        var queryAsync = function (keyword, page) {
            var deferred = $.Deferred();

            page = Math.max((page || 0) - 1, 0);

            IO.requestAsync({
                url : Actions.actions.SEARCH + keyword,
                data : {
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
                    subCategories : [],
                    result : [],
                    loading : false,
                    currentPage : 1,
                    pageTotal : 0,
                    currentPage : 1,
                    total : 0,
                    loaded : false
                }
            },
            queryAsync : function (queryCategory, page) {
                var deferred = $.Deferred();

                queryAsync(queryCategory, page).done(function (resp) {
                    resp = this.filterNullValues(resp);
                    resp.total = resp.total > 200 ? 200 : resp.total;
                    resultListCollection.reset(resp.result);
                    this.setState({
                        keyword : searchPageRouter.getQuery(),
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
                searchPageRouter.on('route:search', function (query) {
                    this.setState({
                        keyword : query || '',
                        loading : true,
                        query : query
                    });

                    this.queryAsync(query, this.state.currentPage);
                }, this);

                FormatCategories('subCategories', queryCategory).done(function (resp) {
                    this.setState({
                        subCategories : resp
                    });
                }.bind(this));

            },
            onSearchAction : function (keyword) {
                if (keyword.length) {
                    searchPageRouter.navigate('q/' + keyword, {
                        trigger : true
                    });
                }
            },
            onPaginationSelect : function (target) {
                this.queryAsync(queryCategory, target).done(function () {
                    this.refs['ebook-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            onEbookSelect : function (ebook) {
                searchPageRouter.navigate('/detail/' + ebook.id, {
                    trigger : true
                });
            },
            onFilterSelect : function (prop, item) {
                switch (prop) {
                case 'years':
                    if (!item) {
                        queryYear = '';
                        queryYearText = '';
                    } else if (typeof item === 'string') {
                            queryYear = '';
                            queryYearText = '';
                    } else {
                        queryYearText = item.name;
                        if (item.name !== undefined && item.name.indexOf(Wording.TIME) > 0) {
                            queryYear = item.begin + '-' + item.end;
                        } else {
                            queryYear = item.name;
                        }
                    }
                    break;
                case 'type':
                    queryType = item.type;
                    break;
                case 'rank':
                    queryRankType = item.type;
                    break;
                }

                this.setState({
                    filterSelected : {
                        type : queryType,
                        years : queryYearText,
                        rank : queryRankType,
                        currentPage : 1,
                        pageTotal : 0
                    }
                });

                this.queryAsync(queryCategory);
            },
            render : function () {
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            source="search" />
                        <div>
                            <h4>搜索结果</h4>
                            <span>共 {this.state.total} 部小说</span> 
                        </div>
                        <ResultListView
                            keyword={this.state.keyword}
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
        });

        return CategoryPage;
    });
}(this));
