/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'utilities/QueryString',
        'components/searchbox/SearchBoxView',
        'FormatCategoriesAsync',
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
        Performance,
        FilterNullValues,
        QueryString,
        SearchBoxView,
        FormatCategoriesAsync,
        ResultListView,
        PaginationView,
        FilterView,
        SearchPageRouter,
        ResultListCollection,
        FooterView
    ) {


        var PAGE_SIZE = 10;

        var searchPageRouter = SearchPageRouter.getInstance();

        var queryAsync = function (keyword, page) {
            var deferred = $.Deferred();

            page = Math.max((page || 0) - 1, 0);

            IO.requestAsync({
                url : Actions.actions.SEARCH + keyword,
                data : {
                    start : page * PAGE_SIZE,
                    max : PAGE_SIZE,
                    pos : 'search'
                },
                xhrFields: {
                   withCredentials: true
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

        var SearchPage = React.createClass({
            mixins : [FilterNullValues, Performance],
            getInitialState : function () {
                return {
                    result : [],
                    loading : false,
                    currentPage : 1,
                    pageTotal : 0,
                    currentPage : 1,
                    keyword : searchPageRouter.getQuery(),
                    total : 0,
                    loaded : false
                }
            },
            queryAsync : function (keyword, page) {
                var deferred = $.Deferred();

                queryAsync(keyword, page).done(function (resp) {
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

                    this.loaded();
                }.bind(this));

                return deferred.promise();
            },
            componentWillMount : function () {
                this.initPerformance('search', 2, this.state.keyword);
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
            },
            onSearchAction : function (keyword) {
                if (keyword.length) {
                    searchPageRouter.navigate('q/' + keyword, {
                        trigger : true
                    });
                }
            },
            onPaginationSelect : function (target) {
                this.queryAsync(this.state.keyword, target).done(function () {
                    this.refs['ebook-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            onEbookSelect : function (ebook) {
                this.setTimeStamp(new Date().getTime(), ebook.id);
                searchPageRouter.navigate('q/' + this.state.keyword + '/detail/' + ebook.id, {
                    trigger : true
                });
            },
            render : function () {
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            keyword={this.state.keyword} 
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            loaded={this.loaded}
                            source="search" />
                        <div>
                            <h4 className="cate-title w-text-secondary">搜索结果</h4>
                            <span>共 {this.state.total} 部小说</span> 
                        </div>
                        <ResultListView
                            keyword={this.state.keyword}
                            list={this.state.result}
                            loading={this.state.loading}
                            total={this.state.total}
                            current={this.state.currentPage}
                            correctQuery={this.state.correctQuery}
                            onEbookSelect={this.onEbookSelect}
                            loaded={this.state.loaded}
                            source="search"
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

        return SearchPage;
    });
}(this));
