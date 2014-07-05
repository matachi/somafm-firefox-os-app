var app = app || {};

(function() {
  'use strict';

  app.Station = Backbone.Model.extend({
    defaults: {
      title: 'Station name',
      description: '',
      dj: ''
    }
  });
})();
