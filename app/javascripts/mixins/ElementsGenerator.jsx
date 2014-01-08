/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'GA',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Wording,
        GA,
        DownloadHelper,
        ReadableSize,
        FormatString
    ) {

        var ElementsGenerator = {
            clickButtonDownload : function (source, video) {
                var installPlayerApp = this.refs !== undefined && this.refs['player-app'].state.checked;

                DownloadHelper.download(this.props.ebook.get('videoEpisodes'), installPlayerApp);

                if (this.props.subscribed !== -2) {
                    this.showSubscribeBubble('download_all', video);
                }

                // GA.log({
                //     'event' : 'video.download.action',
                //     'action' : 'btn_click',
                //     'pos' : source,
                //     'video_id' : this.props.ebook.id,
                //     'video_source' : this.props.ebook.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.ebook.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                //     'video_title' : this.props.ebook.get('title'),
                //     'video_type' : this.props.ebook.get('type'),
                //     'video_category' : this.props.ebook.get('categories'),
                //     'video_year' : this.props.ebook.get('year'),
                //     'video_area' : this.props.ebook.get('region')
                // });
            },
            showSubscribeBubble : function (source, video) {
                if (this.props.subscribed === 0) {
                    if (source === 'subscribe') {
                        this.subscribeCallback.call(this, 2);
                        this.subscribeBubbleView.doSubscribe(video, source);
                    }

                    if (source !== 'subscribe' || sessionStorage.getItem('subscribe') === null) {
                        this.subscribeBubbleView.setState({
                            subscribeBubbleShow : true,
                            source : source
                        });
                    }

                    // GA.log({
                    //     'event' : 'video.misc.action',
                    //     'action' : 'subscribe_popup',
                    //     'type' : 'display',
                    //     'pos' : source,
                    //     'video_id' : this.props.ebook.id,
                    //     'video_source' : this.props.ebook.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.ebook.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                    //     'video_title' : this.props.ebook.get('title'),
                    //     'video_type' : this.props.ebook.get('type'),
                    //     'video_category' : this.props.ebook.get('categories'),
                    //     'video_year' : this.props.ebook.get('year'),
                    //     'video_area' : this.props.ebook.get('region')
                    // });
                } else {
                    if (source === 'subscribe') {
                        this.subscribeCallback.call(this, 2);
                        this.subscribeBubbleView.doUnsubscribe(video);
                    }
                }
            },
            mouseEvent : function (evt) {
                if (evt === 'onMouseEnter' && this.props.subscribed === 1) {
                    this.subscribeCallback.call(this, -1);
                } else if (evt === 'onMouseLeave' && this.props.subscribed === -1) {
                    this.subscribeCallback.call(this, 1);
                }
            },
            moreProvider : function () {

                var EventListener = function (event) {
                    if (event.target.className !== 'arrow' && event.target.name !== 'more-provider') {
                        toggleBubbleState(false);
                    }
                    document.body.removeEventListener('click', EventListener, false);
                };

                var toggleBubbleState = function (boolean) {
                    this.providersBubbleView.setState({
                        providersBubbleShow : boolean
                    });
                    if (boolean) {
                        document.getElementById('more-provider').className = 'w-btn w-btn-primary more-provider active';
                    } else {
                        document.getElementById('more-provider').className = 'w-btn w-btn-primary more-provider';
                    }
                }.bind(this);

                document.body.addEventListener('click', EventListener, false);
                toggleBubbleState(!this.providersBubbleView.state.providersBubbleShow);
            },
            getProviderEle : function () {
                var text = this.props.ebook.get('providerNames').join(' / ');
                return <span className="provider w-wc w-text-info">{Wording.PROVIDERNAMES_LABEL + (text || Wording.INTERNET)}</span>
            },
            getDownloadBtn : function (source) {
                return (
                    <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source, this.props.ebook.get('subscribeUrl'))}>
                        {Wording.READ}
                        <span className="size w-text-info bubble-download-tips w-wc">{Wording.DOWNLOAD_TIPS}</span>
                    </button>
                );
            },
            clickButtonPlay : function (url) {
                var episode = this.props.ebook.get('videoEpisodes')[0];
                var video = this.props.ebook.toJSON();

                var $a = $('<a>').attr({
                    href : url,
                    target : '_default'
                })[0].click();

                // GA.log({
                //     'event' : 'video.play.action',
                //     'action' : 'btn_click',
                //     'video_source' : episode.playInfo[0].title,
                //     'video_id' : episode.video_id,
                //     'episode_id' : episode.id,
                //     'video_title' : video.title,
                //     'video_type' : video.type,
                //     'video_category' : video.categories,
                //     'video_year' : video.year,
                //     'video_area' : video.region,
                //     'video_num' : video.totalEpisodesNum
                // });

                $.ajax({
                    url : 'http://oscar.wandoujia.com/api/v1/monitor',
                    data : {
                        event : 'video_play_start',
                        client : JSON.stringify({
                            type : 'windows'
                        }),
                        resource : JSON.stringify({
                            videoId : episode.video_id,
                            videoEpisodeId : episode.id,
                            provider : episode.playInfo[0].title,
                            url : episode.playInfo[0].url
                        })
                    }
                });
            },
            getPlayBtn : function (source) {
                var episodes  = this.props.ebook.get('videoEpisodes');
                if (this.props.ebook.get('type') === 'MOVIE' && episodes[0].playInfo !== undefined && episodes[0].playInfo.length > 0 && episodes[0].playInfo[0].url !== undefined) {
                    return (
                        <button className="button-play w-btn" onClick={this.clickButtonPlay.bind(this, episodes[0].playInfo[0].url)}>
                            {Wording.PLAY}
                        </button>
                    );

                } else {
                    return ' ';
                }
            },
            getSubscribeBtn : function (source) {
                var text;
                var baseClassName = 'button-subscribe w-btn';
                var className;

                if (this.props.ebook.get('subscribeUrl') === undefined || this.props.subscribed === -2) {
                    return false;
                }
                if (this.props.subscribed === 1) {
                    className = baseClassName + ' subscribing';
                    text = Wording.SUBSCRIBING;
                } else if (this.props.subscribed === -1) {
                    className = baseClassName + ' w-btn-danger';
                    text = Wording.UNSUBSCRIBE;
                } else if (this.props.subscribed === 2) {
                    className = baseClassName + ' loading';
                    text = Wording.LOADING;
                } else {
                        className = baseClassName;
                    text = Wording.SUBSCRIBE;
                }

                return <button id="button-subscribe" class={className} onClick={this.showSubscribeBubble.bind(this, 'subscribe', this.props.ebook)} onMouseEnter={this.mouseEvent.bind(this, 'onMouseEnter')} onMouseLeave={this.mouseEvent.bind(this, 'onMouseLeave')}>{text}</button>
            },
            handleChange : function (evt) {
                if (event.target.checked === false) {
                    sessionStorage.setItem('unchecked', 'unchecked');
                } else {
                    sessionStorage.removeItem('unchecked');
                }

                // GA.log({
                //     'event' : 'video.misc.action',
                //     'action' : 'app_promotion_checkbox_clicked',
                //     'type' : evt.target.checked
                // });
            },
            getCheckbox : function (name) {
                if (this.props.ebook.get('type') === 'MOVIE') {
                    return (
                        <label class="download-app">
                            <input class="w-checkbox" ref="player-app" onChange={this.handleChange} type="checkbox" />
                            同时下载视频应用
                        </label>
                    );
                }
            },
            getPublishingEle : function () {
                var ebook = this.props.ebook;
                var text = ebook.get('finish') ? Wording.META_FINISHED : Wording.META_SERIES;

                return <div className="publishing w-text-primary w-wc">{FormatString(text, ebook.get('totalChaptersNum'))}</div>;
            },
            getMetaEle : function () {
                var ebook = this.props.ebook;
                var cate;

                if (!!ebook.get('subCategory')) {
                    cate = FormatString(Wording.META_CATE, ebook.get('category').name, ebook.get('subCategory').name);
                } else {
                    cate = FormatString(Wording.META_CATE_SINGLE, ebook.get('category').name);
                }

                var author = FormatString(Wording.META_AUTHOR, ebook.get('authors'));

                var source;
                var providers = ebook.get('providerNames');

                if (providers.length > 3) {
                    source = FormatString(Wording.META_SOURCE_MORE, providers.slice(0, 2).join('、'), providers.length);
                } else {
                    source = FormatString(Wording.META_SOURCE, providers.join('、'));
                }

                return <div className="w-text-secondary w-wc">{cate} · {author} · {source}</div>;
            },
            getActorsEle : function () {
                var text = '';
                var video = this.props.ebook;
                if (video.get('type') === 'VARIETY') {
                    text = Wording.PRESENTER_LABEL + video.get('presenters');
                } else {
                    text = Wording.ACTORS_LABEL + video.get('actors');
                }

                return <div className="actors w-text-secondary w-wc">{text}</div>;
            },
            getCateEle : function () {
                var text = '';
                var data = this.props.ebook.toJSON();
                switch (this.props.ebook.get('type')) {
                case 'VARIETY':
                    text = data.categories;
                    break;
                case 'TV':
                case 'MOVIE':
                case 'COMIC':
                    text = data.categories + ' / ' + FormatString(Wording.YEAR, data.year);
                    break;
                }

                return <div className="w-text-secondary w-wc">{text}</div>;
            },
            getRatingEle : function () {
                var ele;
                var data = this.props.ebook.toJSON();
                if (data.rating !== Wording.NO_RATING) {
                    ele = <span className="h4">{data.rating}</span>;
                } else {
                    ele = data.rating;
                }

                return <div className="w-text-secondary w-wc">{Wording.RATING_LABEL}{ele}</div>;
            }
        };

        return ElementsGenerator;
    });
}(this));
