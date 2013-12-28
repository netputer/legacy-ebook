/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'utilities/Download',
        'utilities/FormatString',
        'utilities/FormatDate',
        'components/WanxiaodouView'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        Download,
        FormatString,
        FormatDate,
        WanxiaodouView
    ) {

        var textEnum = {
            LAST_EPISODE : '第 {0} 集',
            TOTLE_COMPLATE : '{0} 集完',
            NO_RATING : '暂无评分',
            NO_DATA : '暂无数据'
        };

        var DownloadHandler = {
            onClick : function () {
                this.props.onVideoSelect(this.props.data.id);
            }
        };

        var ItemView = React.createClass({
            mixins : [DownloadHandler],
            render : function () {
                var data = this.props.data;
                var rating = data.marketRatings;
                var type = data.type;
                var title = data.title;

                var ele;
                var episode;

                var propTitle = data.title.length > 10 ? data.title : '';

                return (
                    <li className="o-categories-item w-component-card" title={propTitle} onClick={this.onClick}>
                        <div className="cover o-mask">
                            <img src={data.cover.l}/>
                        </div>
                        <div className="info">
                            <span className="title w-wc w-text-secondary">{title}</span>
                            <span className="episode w-wc w-text-info">{episode}</span>
                            <button className="download w-btn w-btn-primary w-btn-mini" onClick={this.download}>下载</button>
                        </div>
                    </li>
                );
            },
            download : function () {
                var videoEpisodes = this.props.data.videoEpisodes;
                var type = this.props.data.type;

                Download.downloadVideo(videoEpisodes, type);
            }
        });

        var VideoListView = React.createClass({
            clickTitle : function () {
                $('<a>').attr({
                    href : 'cate.html#' + this.props.cate.toLowerCase()
                })[0].click();
            },
            render : function () {
                if (this.props.list.length === 0) {
                    if (this.props.loaded) {
                        return (<WanxiaodouView data-type="NO_VIDEO" />);
                    } else {
                        return <div className="o-categories-ctn"/>;
                    }
                } else {
                    return (
                        <div className="o-categories-ctn">
                            <h4 className="w-text-secondary title" onClick={this.clickTitle}>{Wording[this.props.cate]}</h4>
                            <ul className="o-categories-item-container w-cf">
                                {this.renderItem()}
                            </ul>
                        </div>
                    );
                }
            },
            renderItem : function () {
                var result = _.map(this.props.list.slice(1, this.props.list.length), function (video) {
                    return <ItemView data={video} key={video.id} onVideoSelect={this.props.onVideoSelect} />;
                }, this);

                return result;
            }
        });

        return VideoListView;
    });
}(this));
