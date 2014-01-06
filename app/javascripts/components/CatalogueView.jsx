/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'IO',
        'Wording',
        'Actions',
        'utilities/FormatString'
    ], function (
        React,
        IO,
        Wording,
        Actions,
        FormatString
    ) {
        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : FormatString(Actions.actions.CATALOGUE, id),
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var CatalogueView = React.createClass({
            getInitialState : function () {
                return {
                    catalogues : [],
                    more : false
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
            showMore : function () {
                this.setState({
                    more : true
                });
            },
            renderCatalogue : function (volumes) {
                return _.map(volumes, function (volume) {
                    var chapters = _.map(volume.chapters, function (chapter, i) {
                        return (
                            <li key={i}>{chapter.title}</li>
                        );
                    }, this);

                    return (
                        <div className="volume">
                            <strong>{volume.title}</strong>
                            <ul>{chapters}</ul>
                        </div>
                    );
                }, this);
            },
            render : function () {
                return (
                    <div className="o-serires-catalogue">
                        <h5>{Wording.CATALOGUE}</h5>
                        <div className="catalogue">
                            <div className={this.state.more ? 'volumes more' : 'volumes'}>
                                {this.renderCatalogue(this.state.catalogues)}
                            </div>
                            <a className={!this.state.more ? 'show-more' : 'show-more hide'} onClick={this.showMore} dangerouslySetInnerHTML={{ __html : Wording.CATALOGUE_MORE}}></a>
                        </div>
                    </div>
                );
            }
        });

        return CatalogueView;
    });
}(this));
