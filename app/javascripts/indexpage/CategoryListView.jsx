/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'GA',
        'Wording',
        'Actions',
        'mixins/ElementsGenerator',
        'main/models/EbookModel',
        'mixins/FilterNullValues'
    ], function (
        React,
        IO,
        GA,
        Wording,
        Actions,
        ElementsGenerator,
        EbookModel,
        FilterNullValues
    ) {

        var indexCategory = [];

        var getCategoriesAsync = function (start, max) {
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.INDEX_CATEGORY,
                data : {
                    start : start,
                    max : max,
                    pos : 'w/index'
                },
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();
        };

        var getCategoryRankAsync = function (cate, type) {
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    categories : cate,
                    start : 0,
                    max : 12,
                    rank_type : type,
                    opt_fields : 'id,title',
                    pos : 'w/index'
                },
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();

        };

        var BookListView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    downloadTip : false
                };
            },
            onClick : function () {
                this.props.clickItem.bind(this, book.id);
            },
            render : function () {
                var book = this.props.ebook;
                return (
                    <li className="o-categories-item w-component-card" title={book.get('title')}>
                        <div className="cover o-mask" onClick={this.onClick}>
                            <img src={book.get('cover').l} alt={book.get('title')} />
                        </div>
                        <div className="info">
                            <span className="title w-wc w-text-secondary" onClick={this.onClick}>{book.get('title')}</span>
                            <span className="author w-wc w-text-info" onClick={this.onClick}>作者: {book.get('authors')}</span>
                            {this.getDownloadBtn('index')}
                        </div>
                    </li>
                );
            }

        });


        var ItemView = React.createClass({
            getInitialState : function () {
                return {
                    currentTab : 'week_hot',
                    rankType : 'week_hot',
                    rankData : []
                };
            },
            onClick : function (id) {
                this.props.onVideoSelect.call(this, id);
                GA.log({
                    'event' : 'ebook.homepage.click',
                    'ebook_item' : id
                });
            },
            clickCate : function (name) {
                GA.log({
                    'event' : 'ebook.homepage.click',
                    'ebook_category' : name
                });
            },
            clickMore : function () {
                GA.log({
                    'event' : 'ebook.homepage.click',
                    'ebook_more' : 1
                });
            },
            renderSubcategories : function () {
                var subCategories = this.props.category !== undefined ? this.props.category.subCategories : [];
                return _.map(subCategories, function (subCategory, index) {
                    if (index < 6) {
                        return (
                            <a href={'cate.html?category=' + subCategory} onClick={this.clickCate.bind(this, subCategory)} className="o-category-subcate w-text-secondary">{subCategory}</a>
                        );   
                    }
                }, this);
            },
            renderBooks : function () {
                var books = this.props.category !== undefined ? this.props.category.data : [];
                return _.map(books, function (book, index) {
                    var ebook = new EbookModel(FilterNullValues.filterNullValues.call(FilterNullValues, book));
                    return (
                        <BookListView ebook={ebook} clickItem={this.onClick} />
                    );
                }, this);
            },
            renderRankAsync : function (cate, type, evt) {
                getCategoryRankAsync(cate, type).done(function (resp) {
                    this.setState({
                        currentTab : type,
                        rankData : resp.result
                    });
                }.bind(this));
            },
            clickRank : function (cate, type, evt) {
                GA.log({
                    'event' : 'ebook.homepage.click',
                    'top_category' : cate
                });
            },
            renderRanks : function (cate) {
                var type = this.state.rankType || 'week_hot';
                if (this.state.rankData.length === 0 && cate !== undefined) {
                    getCategoryRankAsync(cate, type).done(function (resp) {
                        this.setState({
                            currentTab : type,
                            rankData : resp.result
                        });
                    }.bind(this));
                }

                if (cate !== undefined) {
                    return (
                        <div className="o-category-rank w-component-card">
                            <a href={'top.html?category=' + cate} className="cate-title w-text-secondary">{cate}排行</a>
                            <div className="rank-type">
                                <a className={this.state.currentTab === 'week_hot' ? 'w-text-primary' : 'w-text-info'} href={'top.html?category=' + cate + '#week_hot'} onMouseEnter={this.renderRankAsync.bind(this, cate, 'week_hot')} onClick={this.clickRank.bind(this, cate, 'week_hot')}>周榜</a>
                                <span className="w-text-info">&middot;</span>
                                <a className={this.state.currentTab === 'month_hot' ? 'w-text-primary' : 'w-text-info'} href={'top.html?category=' + cate + '#month_hot'} onMouseEnter={this.renderRankAsync.bind(this, cate, 'month_hot')} onClick={this.clickRank.bind(this, cate, 'month_hot')}>月榜</a>
                                <span className="w-text-info">&middot;</span>
                                <a className={this.state.currentTab === 'history_hot' ? 'w-text-primary' : 'w-text-info'} href={'top.html?category=' + cate + '#history_hot'} onMouseEnter={this.renderRankAsync.bind(this, cate, 'history_hot')} onClick={this.clickRank.bind(this, cate, 'history_hot')}>总榜</a>
                            </div>

                            <ol>
                                {this.renderRankList(cate)}
                            </ol>

                        </div>
                    );
                }
            },
            renderRankList : function (cate) {
                if (this.state.rankData !== undefined) {
                    return _.map(this.state.rankData, function (book, index) {
                        if (index < 10) {
                            return <li><a className="w-text-secondary" href="javascript:void(0)" onClick={this.onClick.bind(this, book.id, this.state.currentTab)} title={book.title}><span className="order-num w-text-primary">{index+1}</span> {book.title}</a></li>;
                        }
                    }, this);
                }
            },
            render : function () {
                if (this.props.category !== undefined) {
                    var name = this.props.category.name;
                }

                return (
                    <section className="w-wc">
                        <div className="o-category-books">
                            <a href={'cate.html?category=' + name} onClick={this.clickCate.bind(this, name)} className="cate-title w-text-secondary">{name}</a>
                            {this.renderSubcategories()}
                            <a href={'cate.html?category=' + name} onClick={this.clickMore} className="category-more w-text-info">更多 &raquo;</a>
                            <ul className="w-wc">
                                {this.renderBooks()}
                            </ul>
                        </div>
                        {this.renderRanks(name)}
                    </section>
                );
            }
        });


        var CategoryListView = React.createClass({
            onVideoSelect : function (id) {
                this.props.onVideoSelect(id);
            },
            clickBanner : function (cate) {
                $('<a>').attr({
                    href : 'cate.html?category=' + cate
                })[0].click();
            },
            getInitialState : function () {
                return {
                    categories :  []
                };
            },
            componentWillMount : function () {
                this.getCategories(0, 6);
            },
            getCategories : function (start, max) {
                getCategoriesAsync(start, max).done(function(resp) {
                    var result = resp.result;
                    var i = start;
                    var cachedCate = {};
                    cachedCate.name = result[0].category.name;
                    cachedCate.subCategories = [];
                    cachedCate.data = [];

                    _.each(result, function(cate, index) {

                        if (cachedCate.name === cate.category.name) {
                            cachedCate.data.push(cate);
                            cachedCate.subCategories = this.props.subCategories[cate.category.name];

                            if (index === result.length - 1) {
                                indexCategory[i] = cachedCate;
                            }
                        } else {
                            indexCategory[i] = cachedCate;
                            cachedCate = {};
                            cachedCate.name = cate.category.name;
                            cachedCate.data = [];
                            cachedCate.subCategories = this.props.subCategories[cate.category.name];
                            cachedCate.data.push(cate);
                            i++;
                        }
                    }, this);

                    this.setState({
                        categories : indexCategory
                    });


                }.bind(this));
            },
            render : function () {
                return (
                    <div className="category-books">
                        <ItemView category={this.state.categories[0]} onVideoSelect={this.onVideoSelect} />
                        <ItemView category={this.state.categories[1]} onVideoSelect={this.onVideoSelect} />
                        <ItemView category={this.state.categories[2]} onVideoSelect={this.onVideoSelect} />
                        <ItemView category={this.state.categories[3]} onVideoSelect={this.onVideoSelect} />

                        <div>
                            <a href="cate.html?category=novel" className="banner-title w-text-secondary w-cf">更多小说分类</a>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '历史')}><div className="banner1"><span>{this.props.count['历史']} 部</span></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '军事')}><div className="banner2"><span>{this.props.count['军事']} 部</span></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '灵异')}><div className="banner3"><span>{this.props.count['灵异']} 部</span></div></div>
                        </div>


                        <ItemView category={this.state.categories[4]} onVideoSelect={this.onVideoSelect} />
                        <ItemView category={this.state.categories[5]} onVideoSelect={this.onVideoSelect} />


                        <div>
                            <a href="cate.html?category=girl" className="banner-title w-text-secondary w-cf">更多女生频道</a>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '穿越重生')}><div className="banner4"><span>{this.props.count['穿越重生']} 部</span></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '幻想言情')}><div className="banner5"><span>{this.props.count['幻想言情']} 部</span></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '同人')}><div className="banner6"><span>{this.props.count['同人']} 部</span></div></div>
                        </div>

                    </div>
                );
            }
        });

        return CategoryListView;
    });
}(this));
