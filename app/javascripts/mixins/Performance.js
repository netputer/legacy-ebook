/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        '_',
        'GA'
    ], function (
        _,
        GA
    ) {
        var doramon = 'ebook';
        var page;
        var loadTimes;
        var timeStamp;
        var query;
        var detailId = 0;

        var Performance = {
            initPerformance : function (p, apiCount, q) {
                page = p;
                loadTimes = apiCount;
                query = q;

                var obj = {
                    'metric' : 'loadTime',
                    'timeSpent' : performance.timing.loadEventEnd - performance.timing.navigationStart
                };

                this.delaySendLog(obj, 5000);
            },
            shouldComponentUpdate: function(nextProps, nextState) {
                if (this.state.firstId !== nextState.firstId && timeStamp) {
                    var obj = {
                        'metric' : 'openDetail',
                        'timeSpent' : new Date().getTime() - timeStamp
                    };

                    this.delaySendLog(obj, 500);

                }
                return !(nextState === this.state);
            },
            setTimeStamp : function (str, id) {
                timeStamp = str;
                detailId = id;
            },
            loaded : function () {
                loadTimes--;
                console.log(new Date().getTime() - performance.timing.navigationStart)
                if (loadTimes === 0) {
                    var obj = {
                        'metric' : 'loadComplete',
                        'timeSpent' : new Date().getTime() - performance.timing.navigationStart
                    };

                    this.delaySendLog(obj, 5000);
                }
            },
            delaySendLog : function (obj, time) {
                var o = {
                    'event' : doramon + '.performance',
                    'page' : page,
                    'metric' : obj.metric,
                    'time' : obj.timeSpent
                };

                if (detailId) {
                    o.id = detailId;
                }

                if (query) {
                    o.query = query;
                }

                setTimeout( function () {
                    console.log(o);
                    GA.log(o);
                }, time);
            }
        }

        return Performance;
    });
}(this));
