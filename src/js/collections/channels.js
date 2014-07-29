var app = app || {};

(function($) {
  'use strict';

  var Channels = Backbone.Collection.extend({

    model: app.Channel,

    localStorage: new Backbone.LocalStorage('channels-backbone'),

    comparator: function(a, b) {
      return a.get('title').toLowerCase() > b.get('title').toLowerCase();
    },

    /**
     * Update the collection with the channels from SomaFM's API.
     */
    update: function() {
      $.ajax({
        url: 'http://somafm.com/channels.xml',
        dataType: 'xml',
        // Do a cross-origin XHR
        // http://stackoverflow.com/questions/13873025/firefox-os-packaged-apps-and-xmlhttprequests
        xhr: function() {
          return new window.XMLHttpRequest({mozSystem: true});
        },
        success: function(response) {
          console.log('Channel list retrieved');
          var json = $.xml2json(response);
          json['#document'].channels.channel.forEach(function(element) {
            var id = element.$.id;
            var title = element.title;
            var description = element.description;
            var image = element.image;
            var dj = element.dj;
            app.channels.create({
              id: id,
              title: title,
              description: description,
              image: image,
              dj: dj
            });
          });
        }, error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
          this.trigger('fail');
        }.bind(this),
      });
    },

  });

  app.channels = new Channels();
})(jQuery);
