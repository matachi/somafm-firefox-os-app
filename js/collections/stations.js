var app = app || {};

(function() {
  'use strict';

  var Stations = Backbone.Collection.extend({
    model: app.Station
  });
})();
