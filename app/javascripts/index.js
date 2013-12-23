require(['config', 'GA'], function (config, GA) {
    require(['indexMain']);

    GA.log({
        'event' : 'video.common.action',
        'action' : 'tab_view',
        'type' : 'homepage'
    });
});
