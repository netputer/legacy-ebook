/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Backbone',
        'components/WanxiaodouView',
        'components/EbookListItemView',
        'components/LoadingView'
    ], function (
        React,
        _,
        $,
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
            render : function () {
                var loadingView = this.props.loading ? <LoadingView fixed={true} /> : '';
                if (this.props.list.length > 0) {
                    var listItemViews = _.map(this.props.list, function (ebook) {
                        return <EbookListItemView source="category" ebook={ebook} key={ebook.id} onEbookSelect={this.props.onEbookSelect} />
                    }, this);

                    return (
                        <div className="o-search-result-ctn">
                            <ul>{listItemViews}</ul>
                            {loadingView}
                        </div>
                    );
                } else {
                    if (this.props.loaded) {
                        return <WanxiaodouView data-tip={this.props.keyword || this.props.category } data-type="NO_SEARCH_RESULT" />;
                    } else {
                        return <div className="o-search-result-ctn" />;
                    }
                }
            }
        });

        return ResultListView;
    });
}(this));
