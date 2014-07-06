var app = app || {};

(function($) {
  'use strict';

  app.ChannelView = Backbone.View.extend({

    tagName: 'li',

    template: JST['js/templates/channel.html'],

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

  });
})(jQuery);
