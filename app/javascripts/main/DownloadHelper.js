/*global define*/
(function (window) {
    define([
        'IO',
        '_',
        '$',
        'GA',
        'Actions'
    ], function (
        IO,
        _,
        $,
        GA,
        Actions
    ) {
        var DownloadHelper = {};

        var dservice = true;

        var providers;

        var downloadAsync = function (ebook, source) {
            var deferred = $.Deferred();
            var title = ebook.get('title');
            var id = ebook.id;
            var icon = ebook.get('cover').s;

            IO.requestAsync({
                url : Actions.actions.EBOOK_DOWNLOAD,
                data : {
                    url : Actions.actions.OFFLINE_READ + '?ebookId=' + id + '&source=windows2x',
                    name : title,
                    icon : icon,
                    pos : source
                }
            });

            IO.requestAsync({
                url : Actions.actions.DOWNLOAD_LOG,
                data : {
                    ebookId : ebook.id
                },
                xhrFields: {
                   withCredentials: true
                }
            });

            return deferred.promise();
        };


        DownloadHelper.download = function (ebook, source) {
            downloadAsync(ebook, source);
        };

        return DownloadHelper;
    });
}(this));
