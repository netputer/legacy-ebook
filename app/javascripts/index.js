require(['config', 'GA'], function (config, GA) {
    require(['indexMain']);

    GA.log({
        'event' : 'ebook.common.action',
        'action' : 'tab_view',
        'type' : 'homepage'
    });
});
