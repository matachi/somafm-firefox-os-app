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
      var that = this;
      this.audioPlayer.addEventListener('error', function() {
        console.log(that.audioPlayer.src);
        // When the src is set to an empty string in the pause method, an error
        // will be thrown and `that.audioPlayer.src` will say that index.html
        // is the src.
        if (this.error.code === this.error.MEDIA_ERR_SRC_NOT_SUPPORTED &&
            that.audioPlayer.src !== '' &&
            that.audioPlayer.src.substr(-5) !== '.html') {
          that.trigger(
            'src_not_supported',
            'The media source is not supported by your device.'
          );
        }
      });
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
      // Need to change the src to stop the device from streaming data, which
      // it appear to do even if the stream is paused
      this.audioPlayer.src = '';
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
