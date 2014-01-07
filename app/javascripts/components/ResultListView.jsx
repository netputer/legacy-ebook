/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'GA',
        'Backbone',
        'components/WanxiaodouView',
        'components/EbookListItemView',
        'components/LoadingView'
    ], function (
        React,
        _,
        $,
        GA,
        Backbone,
        WanxiaodouView,
        EbookListItemView,
        LoadingView
    ) {

        var FilterView = React.createClass({
            render : function () {
            }
        });

        var ResultListView = React.createClass({
            componentDidMount : function () {
                if (!!this.props.keyword) {
                    GA.log({
                        'event' : 'ebook.search.click',
                        'result' : this.props.list.length > 0 ? 1 : 0
                    });
                }
            },
            render : function () {
                var loadingView = this.props.loading ? <LoadingView fixed={true} /> : '';
                if (this.props.list.length > 0) {
                    var listItemViews = _.map(this.props.list, function (ebook, index) {
                        return <EbookListItemView source={this.props.source} index={index} current={this.props.current} ebook={ebook} key={ebook.id} filterSelected={this.props.filterSelected} onEbookSelect={this.props.onEbookSelect} />
                    }, this);

                    return (
                        <div className="o-search-result-ctn">
                            <ul>{listItemViews}</ul>
                            {loadingView}
                        </div>
                    );
                } else {
                    if (this.props.loaded) {
                        return <WanxiaodouView data-tip={this.props.keyword || this.props.category } data-type="NO_RESULT" />;
                    } else {
                        return <div className="o-search-result-ctn" />;
                    }
                }
            }
        });

        return ResultListView;
    });
}(this));
