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
                url : Actions.actions.CATEGORY_SEARCH + '?start=' + start + '&max=' + max,
                success : deferred.resolve,
                error : deferred.reject
            });
            return deferred.promise();
        };


        var ItemView = React.createClass({
            onClick : function (id) {
                this.props.onVideoSelect.call(this, id);
            },
            renderSubcategories : function () {
                var subCategories = this.props.category !== undefined ? this.props.category.subCategories : [];
                return _.map(subCategories, function (subCategory, index) {
                    if (index < 6) {
                        return (
                            <a href="" className="o-category-subcate w-text-info">{subCategory}</a>
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
                return '';
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
                            <a href="" className="more w-text-info">更多 &raquo;</a>
                            <ul className="w-wc">
                                {this.renderBooks()}
                            </ul>
                        </div>
                        <div className="o-category-rank w-component-card">
                            {this.renderRanks(name)}
                        </div>
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
                    href : 'cate.html?' + cate
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
                            <a href="" className="cate-title w-text-secondary w-cf">更多小说分类</a>
                            <div className="o-category-banner w-component-card banner1" onClick={this.clickBanner.bind(this, '历史')}></div>
                            <div className="o-category-banner w-component-card banner2" onClick={this.clickBanner.bind(this, '军事')}></div>
                            <div className="o-category-banner w-component-card banner3" onClick={this.clickBanner.bind(this, '灵异')}></div>
                        </div>


                        <ItemView category={this.state.categories[4]} onVideoSelect={this.onVideoSelect} />
                        <ItemView category={this.state.categories[5]} onVideoSelect={this.onVideoSelect} />


                        <div>
                            <a href="" className="cate-title w-text-secondary w-cf">更多女生频道</a>
                            <div className="o-category-banner w-component-card banner4" onClick={this.clickBanner.bind(this, '穿越重生')}></div>
                            <div className="o-category-banner w-component-card banner5" onClick={this.clickBanner.bind(this, '幻想言情')}></div>
                            <div className="o-category-banner w-component-card banner6" onClick={this.clickBanner.bind(this, '同人')}></div>
                        </div>

                    </div>
                );
            }
        });

        return CategoryListView;
    });
}(this));
