var app = app || {};

$(function() {
  'use strict';

  // Add a method to all strings to make it easy to compare them to each other
  // and eventually sort them case insensitively
  String.prototype.compareTo = function(other) {
    return this.toLowerCase() > other.toLowerCase();
  };

  new app.AppView();
});
