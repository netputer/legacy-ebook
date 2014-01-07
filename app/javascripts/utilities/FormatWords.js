/*global define*/
(function (window) {
    define([], function () {
        var FormatWords = function (words) {
            var output;
            words = words / 1000;

            if (words < 1) {
                output = '小于 1000';
            } else if (words >= 1 && words < 10) {
                output = Math.round(words * 10) / 10 + '千';
            } else {
                words = words / 10;
                output = Math.round(words * 10) / 10 + '万';
            } 
            return output;
        };
        return FormatWords;

    });
}(this));
