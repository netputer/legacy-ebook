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
        'toppage/TopPageRouter',
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
        TopPageRouter,
        ResultListCollection,
        FooterView
    ) {


        var PAGE_SIZE = 10;

        var queryCategory = QueryString.get('category') || '';

        var queryRankType = 'week_hot';

        var topPageRouter = TopPageRouter.getInstance();

        var queryAsync = function (category, page) {
            var deferred = $.Deferred();
            var param;
            var cate;

            if (category.length) {
                param = 'categories';
                cate = category;
            } else {
                param = 'publish_type';
                cate = 'NETWORK_NOVEL';
            }

            page = Math.max((page || 0) - 1, 0);

            IO.requestAsync({
                url : Actions.actions.SEARCH + '?' + param + '=' + cate,
                data : {
                    rank_type : queryRankType,
                    start : page * PAGE_SIZE,
                    max : PAGE_SIZE,
                    pos : 'w/top'
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

        var TopPage = React.createClass({
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

                FormatCategories('subCategories', queryCategory).done(function (resp) {
                    this.setState({
                        subCategories : resp
                    });
                }.bind(this));

                this.queryAsync(queryCategory, this.state.currentPage);
            },
            onSearchAction : function (keyword) {
                if (keyword.length) {
                    topPageRouter.navigate('q/' + keyword, {
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
                topPageRouter.navigate('/detail/' + ebook.id, {
                    trigger : true
                });
            },
            onFilterSelect : function (prop, item) {
                switch (prop) {
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
                        // <FilterView
                        //     list={this.state.result}
                        //     categories={this.state.subCategories}
                        //     filters={this.state.filters}
                        //     onFilterSelect={this.onFilterSelect}
                        //     filterSelected={this.state.filterSelected}
                        //     source="category" />

                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            source="search" />
                        <div>
                            <h4 className="cate-title">{this.state.subCategories !== undefined ? this.state.subCategories[0] : queryCategory}排行榜</h4>
                        </div>
                        <div>
                        filter
                        </div>
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
        });

        return TopPage;
    });
}(this));
