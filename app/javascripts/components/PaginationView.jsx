/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        'React',
        '_',
        'Backbone'
    ], function (
        $,
        React,
        _,
        Backbone
    ) {

        var DotView = React.createClass({
            render : function () {
                return (
                    <div className="o-pagination-dot w-text-info" dangerouslySetInnerHTML={{ __html : '&middot;' }} />
                );
            }
        });

        var PaginationView = React.createClass({
            getDefaultProps : function () {
                return {
                    range : 5
                };
            },
            render : function () {
                if (this.props.total === 1) {
                    return <div />;
                }

                var previousClass = 'o-pagination-arrow previous';
                if (this.props.current === 1) {
                    previousClass += ' disable';
                }

                var nextClass = "o-pagination-arrow next";
                if (this.props.current === this.props.total) {
                    nextClass += ' disable';
                }
                var left = (this.props.range + 1) / 2;
                var right = (this.props.range - 1) / 2;

                var start = 0;
                var count = 0;

                if (this.props.total - this.props.current < right) {
                    start = this.props.total - this.props.range + 1;
                } else {
                    start = this.props.current - left;
                }

                start = Math.max(start, 1);

                var count;
                if (this.props.total - start < this.props.range) {
                    count = this.props.total - start + 1;
                } else {
                    count = this.props.range;
                }

                if (this.props.total === 0) {
                    return (<ul className="o-pagination-ctn" />);
                } else {
                    return (
                        <div className="o-pagination-ctn w-text-primary">
                            <a className={previousClass} onClick={this.goPrevious}>上一页</a>
                            <DotView />
                            {this.getPageCount(start, count)}
                            <a className={nextClass} onClick={this.goNext}>下一页</a>
                        </div>
                    );
                }
            },
            goPrevious : function (evt) {
                var target = $(evt.target);
                if (target.hasClass('disable')) {
                    return;
                }
                this.onSelect.apply(this, [this.props.current - 1]);
            },
            goNext : function (evt) {
                var target = $(evt.target);
                if (target.hasClass('disable')) {
                    return;
                }
                this.onSelect.apply(this, [this.props.current + 1]);
            },
            onSelect : function (target) {
                this.props.onSelect(target);
            },
            getPageCount : function (start, count) {
                var result = [];
                if (this.props.current !== 1) {
                    result.push(<a className="o-pagecount-item" onClick={this.onSelect.bind(this, 1)}>1</a>);
                    result.push(<DotView />);
                } else {
                    result.push(<a className="o-pagecount-item current">1</a>);
                    result.push(<DotView />);
                }

                if (start === 1 ){
                    start++;
                    count--;
                } else if (start > 2) {
                    result.push(<DotView />);
                    result.push(<DotView />);
                }

                var end = start + count - 1;
                if (end === this.props.total) {
                    end--;
                }

                if (start <= end) {
                    var i;
                    for (i = start; i <= end; i ++) {
                        if (this.props.current !== i) {
                            result.push(<a className="o-pagecount-item" onClick={this.onSelect.bind(this, i)}>{i}</a>);
                        } else {
                            result.push(<a className="o-pagecount-item current">{i}</a>);
                        }
                        result.push(<DotView />);
                    }
                }

                if (end < this.props.total - 1) {
                    result.push(<DotView />);
                    result.push(<DotView />);
                }

                if (this.props.current !== this.props.total) {
                    result.push(<a className="o-pagecount-item" onClick={this.onSelect.bind(this, this.props.total)}>{this.props.total}</a>);
                } else {
                    result.push(<a className="o-pagecount-item current" onClick={this.onSelect.bind(this, this.props.total)}>{this.props.total}</a>);
                }

                result.push(<DotView />);

                return result;
            }
        });

        return PaginationView;
    });
}(this));
