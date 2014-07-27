var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({

    el: '#app',

    initialize: function() {
      console.log('Initialize AppView');

      var that = this;
      this.$('.js-show-channels').on('click', function() {
        that.$('#channels-view').removeClass('hidden');
        that.$('#about-view').addClass('hidden');
      });
      this.$('.js-show-about').on('click', function() {
        that.$('#channels-view').addClass('hidden');
        that.$('#about-view').removeClass('hidden');
      });
      this.$('.js-reload-channels').on('click', function() {
        _.invoke(app.channels.toArray(), 'destroy');
        this.addLoadingMessage();
        app.channels.update();
      }.bind(this));

      this.$channelList = this.$el.find('#channel-list');

      this.listenTo(app.channels, 'add', this.addOneSorted);
      this.listenTo(app.channels, 'reset', this.addAll);
      this.listenTo(app.channels, 'fail', this.addRetryMessage);

      this.playbackModel = new app.Playback();
      var playbackView = new app.PlaybackView({model: this.playbackModel});
      this.$el.find('#playback').append(playbackView.render().el);

      String.prototype.compareTo = function(other) {
        return this.toLowerCase() > other.toLowerCase();
      };

      this.addLoadingMessage();
      app.channels.fetch({reset: true});
      if (app.channels.length === 0) {
        app.channels.update();
      }
    },

    addLoadingMessage: function() {
      this.removeMessage();
      this.$channelList.append(
        '<li class="message"><progress></progress><br><br>Retrieving channels.</li>'
      );
    },

    addRetryMessage: function() {
      this.removeMessage();
      var $reloadButton = $('<button class="recommend" role="button">Retry</button>');
      $reloadButton.on('click', this.loadChannels.bind(this));
      var $message = $('<li class="message">Couldn\'t load the channels. Please verify that your Internet connection is working.<br><br></li>');
      $message.append($reloadButton);
      this.$channelList.append($message);
    },

    removeMessage: function() {
      this.$channelList.find('.message').remove();
    },

    loadChannels: function() {
      this.removeMessage();
      this.addLoadingMessage();
      app.channels.fetch({reset: true});
      if (app.channels.length === 0) {
        app.channels.update();
      }
    },

    addOne: function(channel) {
      this.removeMessage();
      var view = new app.ChannelView({
        model: channel,
        playbackModel: this.playbackModel
      });
      this.$channelList.append(view.render().el);
    },

    addOneSorted: function(channel) {
      this.removeMessage();
      var view = new app.ChannelView({
        model: channel,
        playbackModel: this.playbackModel
      });
      var children = this.$channelList.children();
      for (var i = 0; i < children.size(); ++i) {
        var $child = $(children.get(i));
        var title = $child.find('.js-title')[0].textContent.trim();
        if (!channel.get('title').compareTo(title)) {
          $child.before(view.render().el);
          return;
        }
      }
      this.$channelList.append(view.render().el);
    },

    addAll: function() {
      app.channels.each(this.addOne, this);
    },

  });
})();
