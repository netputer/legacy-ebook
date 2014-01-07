/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        GA
    ) {
        var BubbleView = {

            getInitialState : function () {
                return {
                    subscribeBubbleShow : false,
                    providersBubbleShow : false,
                    providerItemsBubbleShow : false,
                    source : ''
                }
            },
            getBubbleClassName : function (name) {
                return this.state[name + 'BubbleShow'] ? ('bubble bubble-' + name + ' show') : ('bubble bubble-' + name);
            },
            closeBubble : function (type) {
                if (type === 'ok') {
                    sessionStorage.setItem('subscribe', 'ok');
                }
                this.setState({
                    subscribeBubbleShow : false,
                    providersBubbleShow : false,
                    providerItemsBubbleShow : false,
                    source : ''
                });
                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'subscribe_popup',
                    'type' : type,
                    'pos' : 'bubble_button',
                    'video_id' : this.props.video !== undefined ? this.props.video.id : ''
                });
            }
        }

        return BubbleView;
    });
}(this));
