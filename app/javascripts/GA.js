(function (window) {
    // var _gaq = _gaq || [];
    // _gaq.push(['_setAccount', 'UA-15790641-43']);
    // _gaq.push(['_trackPageview']);
    // _gaq.push(['cookieDomain', 'none']);

    // (function() {
    //     var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    //     ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    //     var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    // }());

    var log = function (data) {
        var logSwitch = true;
        if (logSwitch) {
            data = data || {};

            var url = 'wdj://window/log.json';
            var datas = [];
            var d;
            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    datas.push(d + '=' + window.encodeURIComponent(data[d]));
                }
            }
            url += '?' + datas.join('&');

            window.OneRingRequest('get', url, '', function (resp) {
                return;
            });
        }
    };

    define(function () {
        var GA = {};

        GA.log = log;
        // function (category, action, label) {
        //     log({
        //         event : 'debug_ebook_' + category,
        //         action : action,
        //         label : label
        //     });
        //     // _gaq.push(['_trackEvent', category, action, label]);
        // };

        return GA;
    });
}(this));
