var app = app || {};

(function() {
  'use strict';

  app.PlaybackView = Backbone.View.extend({

    el: '#playback',

    template: JST['js/templates/playback.html'],

    events: {
      'click button': 'playPauseButton',
    },

    initialize: function() {
      this.listenTo(this.model, 'play', this.play);
      this.listenTo(this.model, 'pause', this.pause);
    },

    render: function() {
      this.$el.html(this.template());
      this.$playPauseButton = this.$('.js-play-pause-button');
      this.$title = this.$('.js-title');
      this.audioPlayer = this.$('#audio-player')[0];
      return this;
    },

    /**
     * Change the media control button to reflect the current state.
     */
    updatePlayPauseButton: function() {
      if (this.model.get('playing')) {
        this.$playPauseButton.attr(
          'class',
          'js-play-pause-button media-icon media-pause'
        );
      } else {
        this.$playPauseButton.attr(
          'class',
          'js-play-pause-button media-icon media-play'
        );
      }
    },

    /**
     * Update the string that says which channel is currently playing.
     */
    updateTitle: function() {
      this.$title.html(this.model.get('channel').get('title'));
    },

    /**
     * Triggered when the model sends a `play` event.
     */
    play: function() {
      var channelId = this.model.get('channel').get('id');
      console.log('Playing ' + channelId);
      // Only change audio src and title if it isn't already loaded
      if (this.audioPlayer.src !== channelId) {
        this.audioPlayer.pause();
        this.audioPlayer.src = 'http://ice.somafm.com/' + channelId;
        this.updateTitle();
      }
      this.audioPlayer.play();
      this.updatePlayPauseButton();
    },

    /**
     * Triggered when the model sends a `pause` event.
     */
    pause: function() {
      this.audioPlayer.pause();
      this.updatePlayPauseButton();
    },

    /**
     * Triggered when the playback view's play-pause button is pressed.
     */
    playPauseButton: function() {
      this.model.pause();
    },

  });
})();
