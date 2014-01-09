/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'GA',
        'utilities/QueryString',
        'Actions',
        'Wording'
    ], function (
        React,
        $,
        IO,
        GA,
        QueryString,
        Actions,
        Wording
    ) {
        var queryCategory = QueryString.get('category') || '';

        var filterWordingArray = {
            words : ['不限', '10万字以下', '10-100万', '100万以上'],
            update : ['不限', '七日内', '半月内', '一月内', '已完结'],
            rank : ['热门', '总阅读', '更新时间', '字数'],
            top_rank : ['周榜', '月榜', '总榜']
        }
        var filterValueArray = {
            words : ['', '0-100', '100-1000', '1000-'],
            update : ['', '7', '15', '30', 'finished'],
            rank : ['hot', 'history_hot', 'update', 'words'],
            top_rank : ['week_hot', 'month_hot', 'history_hot']
        }

        var finishedStatus = 0;

        var FilterView = React.createClass({
            getDefaultProps : function () {
                return {
                    filters : {}
                };
            },
            clickItem : function (prop, value) {
                this.props.onFilterSelect(prop, value === Wording.CATEGORY ? '' : value);
                var key = 'filter_' + prop;
                GA.log({
                    'event' : 'ebook.' + this.props.source + '.click',
                    key : value
                });
            },
            generateCategories : function (title, prop) {
                var selected = this.props.filterSelected[prop];
                var categories = this.props.categories;
                if ((this.props.source === 'finished' || this.props.source === 'top') && finishedStatus === 0) {
                    categories.splice(0, 0, Wording.CATEGORY);
                    finishedStatus = 1;
                }
                if (this.props.source === 'published' && finishedStatus === 0) {
                    categories.splice(0, 0, Wording.CATE_PUBLISHED);
                    finishedStatus = 1;
                }

                var eles =  _.map(categories, function (item, index) {
                    var className = 'item';
                    var showName = item;
                    if (item === selected) {
                        className += ' selected';
                    }
                    if (index === 0) {
                        showName = Wording.ALL + item;
                        if ((this.props.source === 'finished' && selected === 'finished') || (this.props.source === 'published' && selected === 'published') || (this.props.source === 'top' && !selected.length)) {
                            className += ' selected';
                        }
                    }
                    return <li onClick={this.clickItem.bind(this, prop, item)} className={className} key={index}>{showName}</li>
                }, this);
                return (
                    <li className="o-filter-cate-ctn">
                        <span className="title w-text-info">{title}</span>
                        <ul className="o-filter-cate w-text-secondary">
                            {eles}
                        </ul>
                    </li>
                );

            },
            generateEle : function (title, prop) {
                var selected = this.props.filterSelected[prop];
                if (selected === undefined) {
                    return;
                }

                var items = filterWordingArray[prop];
                var values = filterValueArray[prop]

                var eles = _.map(items, function (item, index) {
                    var className = 'item';

                    if (selected === values[index]) {
                        className += ' selected';
                    } else if (!selected.length && index === 0) {
                        className += ' selected';
                    }

                    return <li onClick={this.clickItem.bind(this, prop, values[index])} className={className} key={index}>{item}</li>
                }, this);

                return (
                    <li className="o-filter-cate-ctn">
                        <span className="title w-text-info">{title}</span>
                        <ul className="o-filter-cate w-text-secondary">
                            {eles}
                        </ul>
                    </li>
                );
            },

            render : function () {
                if (this.props.list !== undefined && (this.props.list.length > 0 || this.props.source === 'category')) {
                    if (this.props.source === 'category') {
                        return (
                            <ul className="o-filter-ctn">
                                {this.generateCategories(Wording.SUBCATEGORIES, 'category')}
                                {this.generateEle(Wording.WORD_COUNT, 'words')}
                                {this.generateEle(Wording.UPDATE_TIME, 'update')}
                                {this.generateEle(Wording.RANK, 'rank')}
                            </ul>
                        );
                    } else {
                        return (
                            <ul className="o-filter-ctn">
                                {this.generateCategories(Wording.CATEGORY, 'category')}
                                {this.generateEle(Wording.RANK, 'top_rank')}
                            </ul>
                        );
                    }
                } else {
                    return <div></div>;
                }
            }
        });

        return FilterView;
    });
}(this));
