/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        '_',
        'GA',
        'React',
        'utilities/KeyMapping',
        'components/searchbox/SuggestionItemModel'
    ], function (
        $,
        _,
        GA,
        React,
        KeyMapping,
        SuggestionItemModel
    ) {

        var queryAsync = function (keyword) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/suggest/' + keyword,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var SuggestionItemView = React.createClass({
            selectItem : function (evt) {
                this.props.model.set('selected', true);
            },
            clickItem : function (evt) {
                var keyword = this.props.model.get('body').replace('<em>', '').replace('</em>', '');
                this.props.clickHandler.call(this, keyword);

            },
            render : function () {
                return (
                    <li className={'o-search-box-suggestion-item' + (this.props.model.get('selected') ? ' selected' : '')}
                        dangerouslySetInnerHTML={{__html : this.props.model.get('body')}}
                        onClick={this.clickItem}
                        onMouseEnter={this.selectItem} />
                );
            }
        });

        var SuggestionListView = React.createClass({
            clickItem : function (keyword) {
                this.props.clickHandler.call(this , keyword, 'click');
            },
            render : function () {
                var lists = _.map(this.props.resultModels, function (model) {
                    return <SuggestionItemView model={model} key={model.get('body')} clickHandler={this.clickItem} />
                }, this);

                return (
                    <ul className="o-search-box-suggestion"
                        style={{display : lists.length > 0 ? 'block' : 'none'}}>
                        {lists}
                    </ul>
                );
            }
        });

        var SearchboxView = React.createClass({
            getInitialState : function () {
                return {
                    resultModels : []
                };
            },
            getDefaultProps : function () {
                return {
                    keyword : ''
                };
            },
            showSuggestion : function (evt) {
                var value = evt.target.value;
                queryAsync(value).done(function (resp) {
                    this.setState({
                        resultModels : _.map(resp, function (item) {
                            return new SuggestionItemModel({
                                body : item
                            });
                        })
                    });
                    GA.log({
                        'event' : 'video.misc.action',
                        'action' : 'search_suggestion',
                        'keyword' : value,
                        'type' : 'display',
                        'pos' : this.props.source
                    });
                }.bind(this));
            },
            hideSuggestion : function () {
                setTimeout(function() {
                    this.setState({
                        resultModels : []
                    });
                }.bind(this), 200);
            },
            modelChangeHander : function (model, selected) {
                if (selected) {
                    var previousSelectedModel = _.find(this.state.resultModels, function (m) {
                        return m.get('selected') && (m !== model);
                    });
                    if (previousSelectedModel !== undefined) {
                        previousSelectedModel.set('selected', false);
                    }
                }

                this.setState({
                    resultModels : this.state.resultModels
                });
            },
            componentWillUpdate : function () {
                _.each(this.state.resultModels, function (model) {
                    model.off('change:selected', this.modelChangeHander, this);
                }, this);
            },
            componentDidUpdate : function () {
                _.each(this.state.resultModels, function (model) {
                    model.on('change:selected', this.modelChangeHander, this);
                }, this);
            },
            doSearch : function (key, event) {
                if(typeof key === 'string' && this.props.onAction) {
                    var keyword = key.replace('<em>', '').replace('</em>', '');
                    this.setState({
                        resultModels : []
                    });
                    this.props.onAction(keyword);

                    this.refs['searchBoxInput'].getDOMNode().value = keyword;

                    if(event !== undefined && event !== 'submit') {
                        GA.log({
                            'event' : 'video.misc.action',
                            'action' : 'search_suggestion',
                            'keyword' : keyword,
                            'type' : 'click',
                            'event' : event,
                            'pos' : this.props.source
                        });
                    }
                }
            },
            keypressInput : function (evt) {
                var resultModels = this.state.resultModels;
                var selectedItem;
                var targetItem;
                var index;

                switch (evt.keyCode) {
                case KeyMapping.ESC:
                    this.setState({
                        resultModels : []
                    });
                    break;
                case KeyMapping.ENTER:
                    if (resultModels.length > 0) {
                        selectedItem = _.find(resultModels, function (item) {
                            return item.get('selected');
                        });
                        if (selectedItem !== undefined) {
                            evt.preventDefault();
                            this.doSearch(selectedItem.get('body'), 'keyboard');
                        }
                    }
                    break;
                case KeyMapping.DOWN:
                    if (resultModels.length > 0) {
                        evt.preventDefault();
                        selectedItem = _.find(resultModels, function (item) {
                            return item.get('selected');
                        });
                        if (selectedItem === undefined) {
                            targetItem = resultModels[0];
                        } else {
                            index = resultModels.indexOf(selectedItem);
                            if (index === (resultModels.length - 1)) {
                                targetItem = resultModels[0];
                            } else {
                                targetItem = resultModels[index + 1];
                            }
                        }
                        targetItem.set('selected', true);
                    }
                    break;
                case KeyMapping.UP:
                    if (resultModels.length > 0) {
                        evt.preventDefault();
                        selectedItem = _.find(resultModels, function (item) {
                            return item.get('selected');
                        });
                        if (selectedItem === undefined) {
                            targetItem = resultModels[resultModels.length - 1];
                        } else {
                            index= resultModels.indexOf(selectedItem);
                            if (index === 0) {
                                targetItem = resultModels[resultModels.length - 1];
                            } else {
                                targetItem = resultModels[index - 1];
                            }
                        }
                        targetItem.set('selected', true);
                    }
                    break;
                }
            },
            submitForm : function (evt) {
                evt.preventDefault();
                this.doSearch(evt.target.keyword.value, 'submit');
                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'search',
                    'keyword' : evt.target.keyword.value,
                    'pos' : location.pathname + location.search + location.hash
                });
            },
            render : function () {
                return (
                    <form className="o-search-box w-form-inline" action="search.html" method="get" onSubmit={this.submitForm}>
                        <div className="o-search-box-wrap">
                            <input
                                ref="searchBoxInput"
                                className="o-search-box-input w-input w-form-inline w-input-large"
                                placeholder="搜索书名、作者"
                                type="text"
                                name="keyword"
                                autoComplete="off"
                                defaultValue={this.props.keyword}
                                onChange={this.showSuggestion}
                                onFocus={this.showSuggestion}
                                onBlur={this.hideSuggestion}
                                onKeyDown={this.keypressInput} />
                            <SuggestionListView resultModels={this.state.resultModels} clickHandler={this.doSearch}/>
                        </div>
                        <button className="w-btn w-btn-large w-btn-primary">搜索</button>
                    </form>
                );
            }
        });

        return SearchboxView;
    });
}(this));
