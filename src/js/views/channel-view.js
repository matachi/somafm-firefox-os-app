var app = app || {};

(function() {
  'use strict';

  app.ChannelView = Backbone.View.extend({

    tagName: 'li',

    template: JST['js/templates/channel.html'],

    events: {
      'click': 'play',
    },

    initialize: function(options) {
      this.playbackModel = options.playbackModel;
      var that = this;
      this.listenTo(this.model, 'destroy', function() {
        that.remove();
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    play: function() {
      this.playbackModel.play(this.model);
    },

  });
})();
