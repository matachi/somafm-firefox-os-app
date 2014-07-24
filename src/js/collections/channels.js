var app = app || {};

(function() {
  'use strict';

  var Channels = Backbone.Collection.extend({
    model: app.Channel,
    localStorage: new Backbone.LocalStorage('channels-backbone'),
    comparator: function(a, b) {
      return a.attributes.title.charAt(0).toLowerCase().charCodeAt(0) - b.attributes.title.charAt(0).toLowerCase().charCodeAt(0);
    },
  });

  app.channels = new Channels();
})();
