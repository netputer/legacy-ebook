/*global define*/
(function (window) {
    define([], function () {
        var FormatWords = function (words) {
            var output;
            words = words / 1000;

            if (words < 1) {
                return '少于一千';
            }

            if (words >= 1 && words < 10) {
                return Math.round(words * 10) / 10 + ' 千';
            }

            words = words / 10;
            return Math.round(words * 10) / 10 + ' 万';
        };

        return FormatWords;
    });
}(this));
