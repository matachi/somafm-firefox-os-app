var app = app || {};

(function() {
  'use strict';

  app.Channel = Backbone.Model.extend({
    defaults: {
      id: '',
      title: 'Channel name',
      description: '',
      image: '',
      dj: ''
    }
  });
})();
