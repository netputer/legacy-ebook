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
                    totalCatalogues : [],
                    asc : true,
                    page : 1,
                    showedMore : false,
                    showedAll : false
                };
            },
            componentWillMount : function () {
                queryAsync(this.props.ebook.get('id')).done(function (catalogues) {
                    var result = [];

                    _.map(catalogues.volumes, function (volume) {
                        result = result.concat(volume.chapters);
                    });

                    this.setState({
                        totalCatalogues : result,
                        catalogues : result.slice(0, this.state.page * 15)
                    });

                    this.props.setFirstId(result[0].id);
                }.bind(this));
            },
            sortReverse : function () {
                var newTotalCatalogues = this.state.totalCatalogues.reverse();

                this.setState({
                    totalCatalogues : newTotalCatalogues,
                    catalogues : newTotalCatalogues.slice(0, this.state.page * 15),
                    asc : !this.state.asc
                });
            },
            sortAsc : function () {
                if (this.state.asc) {
                    return;
                }

                this.sortReverse();
            },
            sortDesc : function () {
                if (!this.state.asc) {
                    return;
                }

                this.sortReverse();
            },
            showMore : function () {
                var newPage = this.state.page + 1;

                this.setState({
                    catalogues : this.state.totalCatalogues.slice(0, newPage * 15),
                    page : newPage,
                    showedMore : true
                });
            },
            showAll : function () {
                this.setState({
                    catalogues : this.state.totalCatalogues,
                    showedAll : true
                });
            },
            renderSort : function () {
                var sortClassName = React.addons.classSet({
                    'sort' : true,
                    'asc' : this.state.asc,
                    'desc' : !this.state.asc,
                });

                return (
                    <div className={sortClassName}>
                        <a className="show-asc" onClick={this.sortAsc}>正序</a>
                        <span> · </span>
                        <a className="show-desc" onClick={this.sortDesc}>倒序</a>
                    </div>
                );
            },
            renderCatalogue : function (chapters) {
                return _.map(chapters, function (chapter, i) {
                    return (
                        <li key={i}>{chapter.title}</li>
                    );
                }, this);
            },
            render : function () {
                var catalogueClassName = React.addons.classSet({
                    'catalogue' : true,
                    'showed-more' : this.state.showedMore,
                    'showed-all' : this.state.showedAll,
                });

                return (
                    <div className="o-serires-section o-serires-catalogue">
                        <div className="w-hbox">
                            <h5>{Wording.CATALOGUE}</h5>
                            {this.renderSort()}
                        </div>
                        <div className={catalogueClassName}>
                            <ul className="chapters">
                                {this.renderCatalogue(this.state.catalogues)}
                            </ul>
                            <div className="control">
                                <a className="show-more" onClick={this.showMore}>{Wording.CATALOGUE_SHOW_MORE}</a>
                                <a className="show-all" onClick={this.showAll}>{Wording.CATALOGUE_SHOW_ALL}</a>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return CatalogueView;
    });
}(this));
