/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'GA',
        'mixins/ElementsGenerator',
        'utilities/FormatString',
        'utilities/FormatWords',
        'utilities/FormatDate',
        'components/DownloadBubbleView'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        ElementsGenerator,
        FormatString,
        FormatWords,
        FormatDate,
        DownloadBubbleView
    ) {
        var InfoView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    downloadTip : false
                };
            },
            onClick : function () {
                this.props.onSelect();
            },
            render : function () {
                var data = this.props.ebook;
                var descriptionLength = 100;

                var showWords = function () {
                    if (this.props.filterSelected !== undefined && (this.props.filterSelected['words'] || this.props.filterSelected['rank'] === 'words')) {
                         return (
                            <span>
                                <span> &middot; </span>
                                {this.getWordsEle()}
                            </span>
                        );
                    }
                }.bind(this);

                var showDate = function () {
                    if (this.props.filterSelected !== undefined && (this.props.filterSelected['update'] || this.props.filterSelected['rank'] === 'update')) {
                         return (
                            <span>
                                <span> &middot; </span>
                                {this.getUpdateEle()}
                            </span>
                        );
                    }
                };

                return (
                    <div className="info-container">
                        <h4 className="title w-wc" dangerouslySetInnerHTML={{ __html : data.get('title') }} onClick={this.onClick}></h4>
                        <div>
                            {this.getPublishingEle()}
                            <span> &middot; </span>
                            {this.getCateEle()}
                            <span> &middot; </span>
                            {this.getAuthorEle()}
                            <span> &middot; </span>
                            {this.getCountEle()}
                            {showWords}
                            {showDate}
                        </div>
                        <div className="w-text-info description">
                            {data.get('description') !== undefined && data.get('description').length > descriptionLength ? data.get('description').substr(0, descriptionLength) + '...' : data.get('description')}
                        </div>
                        <div className="download-ctn w-hbox">
                            {this.getDownloadBtn(this.props.source)}
                            <DownloadBubbleView show={this.state.downloadTip} />
                        </div>
                    </div>
                );
            }
        });


        var EbookListItemView = React.createClass({
            clickItem : function () {
                this.props.onEbookSelect(this.props.ebook);
                var index = this.props.index;
                if (this.props.source === 'search') {
                    GA.log({
                        'event' : 'ebook.search.click',
                        'ebook_item' : this.props.ebook.id,
                        'position' : index < 3 ? index + 1 : 4
                    });
                } else {
                    GA.log({
                        'event' : 'ebook.' + this.props.source + '.click',
                        'ebook_item' : this.props.ebook.id
                    });
                }
            },
            renderOrder : function () {
                if (this.props.source === 'top' && this.props.current === 1) {
                    return (
                        <div className="order-num">
                            <span className="order-bg w-text-thirdly">{this.props.index+1}</span>
                        </div>
                    );
                }
            },
            render : function () {
                var data = this.props.ebook;

                return (
                    <li className="o-list-item w-hbox w-component-card">
                        <div className="o-mask item-cover"
                            style={{ 'background-image' : 'url(' + (data.get('cover').l || "") + ')' }}
                            onClick={this.clickItem}>
                            {this.renderOrder()}
                        </div>
                        <InfoView ebook={data} source={this.props.source} filterSelected={this.props.filterSelected} onSelect={this.clickItem} />

                    </li>
                );
            }
        });

        return EbookListItemView;
    });
}(this));
