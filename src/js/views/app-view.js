var app = app || {};

(function($) {
  'use strict';

  app.AppView = Backbone.View.extend({

    el: '#app',

    initialize: function() {
      console.log('Initialize AppView');

      this.$channelList = $('#channel-list');

      this.audioPlayer = $('#audio-player')[0];

      this.listenTo(app.channels, 'add', this.addOne);
      this.listenTo(app.channels, 'reset', this.addAll);

      _.invoke(app.channels.toArray(), 'destroy');

      $.ajaxSetup({
        xhr: function() {
          return new window.XMLHttpRequest({mozSystem: true});
        }
      });

      $.ajax({
        url: 'http://somafm.com/channels.xml',
        dataType: 'xml',
        success: function(response) {
          console.log('Channel list received');
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
        }
      });

      app.channels.fetch({reset: true});
    },

    render: function() {
      console.log('Render AppView');
      this.$el.append('kalle');
    },

    addOne: function(channel) {
      var view = new app.ChannelView({model: channel});
      this.listenTo(view, 'play', this.play);
      this.$channelList.append(view.render().el);
    },

    addAll: function() {
      app.channels.each(this.addOne, this);
    },

    play: function(channelId) {
      this.audioPlayer.src = 'http://ice.somafm.com/' + channelId;
      this.audioPlayer.play();
    },

  });
})(jQuery);
