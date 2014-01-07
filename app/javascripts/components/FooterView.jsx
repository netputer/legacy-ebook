/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO'
    ], function (
        React,
        IO
    ) {
        var FooterView = React.createClass({
            render : function () {
                return (
                    <footer className="o-footer w-text-info">
                        <p>
                            &copy; 2010 - 2014 豌豆实验室
                        </p>
                    </footer>
                );
            }
        });

        return FooterView;
    });
}(this));
