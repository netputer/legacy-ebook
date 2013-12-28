/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'GA',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        FormatString
    ) {
        var InfoView = React.createClass({
            render : function () {
                var data = this.props.data;
                var descriptionLength = 100;
                var statusWording;
                var statusClassName;

                if (data.finish) {
                    statusWording = Wording.FINISHED;
                    statusClassName = 'status-finished';
                } else if (!!data.subscribeUrl) {
                    statusWording = Wording.SERIES;
                    statusClassName = 'status-series';
                }

                return (
                    <div className="info-container">
                        <h4 className="title w-wc" dangerouslySetInnerHTML={{ __html : data.title }} onClick={this.props.onSelect}></h4>
                        <div>
                            <span className={statusClassName + ' w-text-secondary'}>{!!statusWording ? statusWording + ' · ' : ''}</span>
                            <span className="w-text-info">分类: {data.category.name}{data.subCategory ? ' / ' + data.subCategory.name : ''} · </span>
                            <span className="w-text-info">作者: {data.authors.join('、')}</span>
                        </div>
                        <div className="w-text-info">
                            {data.description.length > descriptionLength ? data.description.substr(0, descriptionLength) + '...' : data.description}
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
            },
            render : function () {
                var data = this.props.ebook;
                return (
                    <li className="o-list-item w-hbox w-component-card">
                        <div className="o-mask item-cover"
                            style={{ 'background-image' : 'url(' + (data.cover.l || "") + ')' }}
                            onClick={this.clickItem} />
                        <InfoView data={data} onSelect={this.clickItem} />

                    </li>
                );
            }
        });

        return EbookListItemView;
    });
}(this));
