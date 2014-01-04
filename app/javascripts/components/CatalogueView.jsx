/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'IO'
    ], function (
        React,
        IO
    ) {
        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : 'http://ebooks.wandoujia.com/api/v1/ebooks/' + id + '/catalogues',
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var CatalogueView = React.createClass({
            getInitialState : function () {
                return {
                    catalogues : []
                };
            },
            componentWillMount : function () {
                queryAsync(this.props.ebook.get('id')).done(function (catalogues) {
                    var volumes = catalogues.volumes;

                    this.setState({
                        catalogues : volumes
                    });

                    var firstId = catalogues.volumes[0].chapters[0].id;

                    if (volumes.length > 1) {
                        firstId = catalogues.volumes[1].chapters[0].id;
                    }

                    this.props.setFirstId(firstId);
                }.bind(this));
            },
            renderCatalogue : function (volumes) {
                return _.map(volumes, function (volume) {
                    var chapters = _.map(volume.chapters, function (chapter) {
                        return (
                            <li>{chapter.title}</li>
                        );
                    }.bind(this));

                    return (
                        <div className="volume">
                            <strong>{volume.title}</strong>
                            <ul>{chapters}</ul>
                        </div>
                    );
                }.bind(this));
            },
            render : function () {
                return (
                    <div className="o-serires-catalogue">
                        <h5>目录</h5>
                        <div className="catalogue">
                            {this.renderCatalogue(this.state.catalogues)}
                        </div>
                    </div>
                );
            }
        });

        return CatalogueView;
    });
}(this));
