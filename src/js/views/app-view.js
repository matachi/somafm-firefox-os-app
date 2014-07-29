var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({

    el: '#app',

    initialize: function() {
      console.log('Initialize AppView');

      this.initializeMenuButtons();

      this.$channelList = this.$el.find('#channel-list');

      this.listenTo(app.channels, 'add', this.addOneChannelSorted);
      this.listenTo(app.channels, 'reset', this.addAllChannels);
      this.listenTo(app.channels, 'fail', this.addRetryMessage);

      this.initializePlaybackView();

      this.loadChannels();
    },

    /**
     * Initialize the drawer's menu buttons.
     */
    initializeMenuButtons: function() {
      this.$('.js-show-channels').on('click', function() {
        this.$('#channels-view').removeClass('hidden');
        this.$('#about-view').addClass('hidden');
      }.bind(this));
      this.$('.js-show-about').on('click', function() {
        this.$('#channels-view').addClass('hidden');
        this.$('#about-view').removeClass('hidden');
      }.bind(this));
      this.$('.js-reload-channels').on('click', function() {
        _.invoke(app.channels.toArray(), 'destroy');
        this.addLoadingMessage();
        app.channels.update();
      }.bind(this));
    },

    /**
     * Show playback controls at the bottom of the channel list.
     */
    initializePlaybackView: function() {
      this.playbackModel = new app.Playback();
      var playbackView = new app.PlaybackView({model: this.playbackModel});
      playbackView.on('src_not_supported', this.showStatusMessage.bind(this));
      this.$el.find('#playback').append(playbackView.render().el);
    },

    /**
     * Add a loading message to the channel list's container. This assumes that
     * the channel list is empty or contains another message.
     */
    addLoadingMessage: function() {
      this.removeMessage();

      this.$channelList.append(
        '<li class="message"><progress></progress><br><br>Retrieving channels.</li>'
      );
    },

    /**
     * Add an error message to the channel list's container. This message also
     * contains a button to retry loading the channels from SomaFM's API. This
     * assumes that the channel list is empty or contains another message.
     */
    addRetryMessage: function() {
      this.removeMessage();

      var $reloadButton = $('<button class="recommend" role="button">Retry</button>');
      $reloadButton.on('click', this.loadChannels.bind(this));

      var $message = $('<li class="message">Couldn\'t load the channels. Please verify that your Internet connection is working.<br><br></li>');
      $message.append($reloadButton);

      this.$channelList.append($message);
    },

    /**
     * Remove any message from the channel list's container.
     */
    removeMessage: function() {
      this.$channelList.find('.message').remove();
    },

    /**
     * Load the channels from SomaFM's API.
     */
    loadChannels: function() {
      this.removeMessage();
      this.addLoadingMessage();
      app.channels.fetch({reset: true});
      if (app.channels.length === 0) {
        app.channels.update();
      }
    },

    /**
     * Show a popup status message for 2 seconds.
     *
     * @param {String} message A message to show on the screen.
     */
    showStatusMessage: function(message) {
      var $s = $('section[role$="status"]');
      $s.find('p').html(message);
      $s.addClass('visible');
      setTimeout(function() {
        $s.removeClass('visible');
      }, 2000);
    },

    /**
     * Add one Channel to the channel list by creating its view and appending
     * it to the list container.
     *
     * @param {Channel} channel An instance of Channel.
     */
    addOneChannel: function(channel) {
      this.removeMessage();
      var view = new app.ChannelView({
        model: channel,
        playbackModel: this.playbackModel
      });
      this.$channelList.append(view.render().el);
    },

    /**
     * Add one Channel to the channel list by creating its view and appending
     * it to the list container. Apart from {@link addOneChannel}, which simply
     * appends the Channel to the end of the list, this method adds it
     * alphabetically to the list according to the channel's title.
     *
     * @see {@link addOneChannel} Extends that method.
     * @param {Channel} channel An instance of Channel.
     */
    addOneChannelSorted: function(channel) {
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

    /**
     * Add all channels to the channel list. Since the Channels collection is
     * already sorted it calls the simple version to add individual channels to
     * the list.
     */
    addAllChannels: function() {
      app.channels.each(this.addOneChannel, this);
    },

  });
})();
