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

        var wordCountArray = ['不限', '10万字以下', '10-100万', '100万以上'];

        var updateArray = ['不限', '七日内', '半月内', '一月内', '已完结'];

        var sortArray = ['热门', '总下载', '更新时间', '字数'];


        var FilterView = React.createClass({
            getDefaultProps : function () {
                return {
                    filters : {}
                };
            },
            clickItem : function (prop, value) {
                this.props.onFilterSelect(prop, value);
                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'filter_clicked',
                    'type' : prop,
                    'keyword' : value.name,
                    'pos' : this.props.source,
                    'mode' : this.props.source === 'search' ? 'search' : 'view'
                });
            },
            generateEle : function (title, prop) {

                var eles = _.map(prop, function (item, i) {
                    var className = 'item';

                    if (queryCategory === item) {
                        className += ' selected';
                    }
                    if (i === 0 && title === Wording.SUBCATEGORIES) {
                        item = '全部' + item;
                    }
                    return <li onClick={this.clickItem.bind(this, prop, item)} className={className} key={i}>{item}</li>
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
            getRankTypeEle : function () {
                var filters = [{
                    name : Wording.REL,
                    type : 'rel'
                }, {
                    name : Wording.HOT,
                    type : 'hot'
                }, {
                    name : Wording.RATING,
                    type : 'rate'
                }, {
                    name : Wording.UPDATE_TIME,
                    type : 'update'
                }];

                var selected = this.props.filterSelected['rank'];

                var eles = _.map(filters, function (item, i) {
                    var className = selected === item.type ? 'item selected' : 'item';
                    if (item.type === 'rel' && this.props.filters.categories) {
                        return;
                    } else {
                        return <li onClick={this.clickItem.bind(this, 'rank', item)} className={className} key={i}>{item.name}</li>
                    }
                }, this);

                return (
                    <li className="o-filter-cate-ctn">
                        <span className="title w-text-info">{Wording.SORT}</span>
                        <ul className="o-filter-cate w-text-secondary">
                            {eles}
                        </ul>
                    </li>
                );
            },
            render : function () {
                if (this.props.list !== undefined && this.props.list.length > 0) {
                    return (
                        <ul className="o-filter-ctn w-component-card">
                            {this.props.categories !== undefined ? this.generateEle(Wording.SUBCATEGORIES, this.props.categories) : ''}
                            {this.generateEle(Wording.WORD_COUNT, wordCountArray)}
                            {this.generateEle(Wording.UPDATE_TIME, updateArray)}
                            {this.generateEle(Wording.SORT, sortArray)}
                        </ul>
                    );
                } else {
                    return <div></div>;
                }
            }
        });

        return FilterView;
    });
}(this));
