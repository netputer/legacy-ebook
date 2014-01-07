/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'GA',
        'utilities/FormatString',
        'utilities/FormatWords',
        'utilities/FormatDate'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        FormatString,
        FormatWords,
        FormatDate
    ) {
        var InfoView = React.createClass({
            render : function () {
                var data = this.props.data;
                var descriptionLength = 100;
                var statusWording;
                var statusClassName;

                if (data.finish) {
                    statusWording = Wording.FINISHED;
                    statusClassName = 'status-finished w-text-secondary';
                } else {
                    statusWording = Wording.SERIES;
                    statusClassName = 'status-series w-text-primary';
                }

                var showDate = '';
                if (this.props.filterSelected !== undefined && (this.props.filterSelected['update'] || this.props.filterSelected['rank'] === 'update')) {
                     showDate = ' · 更新时间: '  + FormatDate('kindly', data.updatedDate);
                }

                var showWords = '';
                if (this.props.filterSelected !== undefined && (this.props.filterSelected['words'] || this.props.filterSelected['rank'] === 'words')) {
                    showWords = ' · 字数: ' + FormatWords(data.words);
                }

                return (
                    <div className="info-container">
                        <h4 className="title w-wc" dangerouslySetInnerHTML={{ __html : data.title }} onClick={this.props.onSelect}></h4>
                        <div>
                            <span className={statusClassName}>{!!statusWording ? statusWording + ' · ' : ''}</span>
                            <span className="w-text-info">分类: {data.category.name}{data.subCategory ? ' / ' + data.subCategory.name : ''} · </span>
                            <span className="w-text-info">作者: {data.authors.join('、')} · </span>
                            <span className="w-text-info">{data.totalChaptersNum} 章</span>
                            <span className="w-text-info">{showWords}</span>
                            <span className="w-text-info">{showDate}</span>
                        </div>
                        <div className="w-text-info description">
                            {data.description !== undefined && data.description.length > descriptionLength ? data.description.substr(0, descriptionLength) + '...' : data.description}
                        </div>
                        <div className="download-ctn w-hbox">
                            <button className="button-download w-btn w-btn-primary" onClick={this.props.onSelect}>{Wording.READ}</button>
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
                            style={{ 'background-image' : 'url(' + (data.cover.l || "") + ')' }}
                            onClick={this.clickItem}>
                            {this.renderOrder()}
                        </div>
                        <InfoView data={data} filterSelected={this.props.filterSelected} onSelect={this.clickItem} />

                    </li>
                );
            }
        });

        return EbookListItemView;
    });
}(this));
