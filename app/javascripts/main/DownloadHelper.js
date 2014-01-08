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

        var downloadAsync = function (title, id, source) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.EBOOK_DOWNLOAD,
                data : {
                    url : Actions.actions.OFFLINE_READ + '?ebookId=' + id + '&source=windows2x',
                    name : title,
                    icon : '',
                    pos : 'w/' + source
                }
            });

            return deferred.promise();
        };


        DownloadHelper.download = function (source, ebook) {
            downloadAsync(ebook.get('title'), ebook.id, source);

            GA.log({

            });
        };

        return DownloadHelper;
    });
}(this));
