var app = app || {};

(function() {
  'use strict';

  var Channels = Backbone.Collection.extend({
    model: app.Channel,
    localStorage: new Backbone.LocalStorage('channels-backbone'),
    comparator: function(a, b) {
      return a.get('title').toLowerCase() > b.get('title').toLowerCase();
    },
  });

  app.channels = new Channels();
})();
