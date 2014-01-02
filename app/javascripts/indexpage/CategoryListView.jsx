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

        var indexCategory = [];

        var getCategoriesAsync = function (start, max) {
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.INDEX_CATEGORY + '?start=' + start + '&max=' + max,
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();
        };

        var getCategoryRankAsync = function (cate, type) {

            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.SEARCH + '?categories=' + cate + '&start=0&max=12&rank_type=' + type + '&opt_fields=id,title',
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();

        };


        var ItemView = React.createClass({
            getInitialState : function () {
                return {
                    rankType : 'week_hot',
                    rankData : []
                };
            },
            onClick : function (id) {
                this.props.onVideoSelect.call(this, id);
            },
            renderSubcategories : function () {
                var subCategories = this.props.category !== undefined ? this.props.category.subCategories : [];
                return _.map(subCategories, function (subCategory, index) {
                    if (index < 6) {
                        return (
                            <a href={'cate.html?category=' + subCategory} className="o-category-subcate w-text-secondary">{subCategory}</a>
                        );   
                    }
                });
            },
            renderBooks : function () {
                var books = this.props.category !== undefined ? this.props.category.data : [];
                return _.map(books, function (book, index) {
                    return (
                        <li className="o-categories-item w-component-card" title={book.title} onClick={this.onClick.bind(this, book.id)}>
                            <div className="cover o-mask">
                                <img src={book.cover.l} alt={book.title} />
                            </div>
                            <div className="info">
                                <span className="title w-wc w-text-secondary">{book.title}</span>
                                <span className="author w-wc w-text-info">作者：{book.authors}</span>
                            </div>
                        </li>
                    );
                }, this);
            },
            renderRanks : function (cate) {
                var type = this.state.rankType || 'week_hot';
                if (this.state.rankData.length === 0 && cate !== undefined) {
                    getCategoryRankAsync(cate, type).done(function (resp) {
                        this.setState({
                            rankData : resp.result
                        });
                    }.bind(this));
                }

                if (cate !== undefined) {                   
                    return (
                        <div className="o-category-rank w-component-card">
                            <a href={'top.html?category=' + cate} className="cate-title w-text-secondary">{cate}排行</a>
                            <div className="rank-type">
                                <a className="current" href={'top.html?category=' + cate + '#week_hot'}>周榜</a>
                                <span className="w-text-info">&middot;</span>
                                <a className="w-text-info" href={'top.html?category=' + cate + '#month_hot'}>月榜</a>
                                <span className="w-text-info">&middot;</span>
                                <a className="w-text-info" href={'top.html?category=' + cate + '#historyhot'}>总榜</a>
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
                            return <li><a className="w-text-secondary" href="javascript:void(0)" onClick={this.onClick.bind(this, book.id)} title={book.title}><span className="order-num w-text-primary">{index+1}</span> {book.title}</a></li>;
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
                            <a href="" className="cate-title w-text-secondary">{name}</a>
                            {this.renderSubcategories()}
                            <a href={'cate.html?category=' + name} className="category-more w-text-info">更多 &raquo;</a>
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
                            <a href="cate.html?categories=novel" className="cate-title w-text-secondary w-cf">更多小说分类</a>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '历史')}><div className="banner1"></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '军事')}><div className="banner2"></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '灵异')}><div className="banner3"></div></div>
                        </div>


                        <ItemView category={this.state.categories[4]} onVideoSelect={this.onVideoSelect} />
                        <ItemView category={this.state.categories[5]} onVideoSelect={this.onVideoSelect} />


                        <div>
                            <a href="cate.html?categories=girl" className="cate-title w-text-secondary w-cf">更多女生频道</a>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '穿越重生')}><div className="banner4"></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '幻想言情')}><div className="banner5"></div></div>
                            <div className="o-category-banner w-component-card" onClick={this.clickBanner.bind(this, '同人')}><div className="banner6"></div></div>
                        </div>

                    </div>
                );
            }
        });

        return CategoryListView;
    });
}(this));
