var app = app || {};

(function() {
  'use strict';

  app.Playback = Backbone.Model.extend({
    defaults: {
      playing: false,
      channel: null,
    },

    /**
     * Start playing a channel. If it's already playing it's paused instead.
     *
     * @param {app.Channel} channel A Channel instance.
     */
    play: function(channel) {
      // Pause playback if it's already playing this channel
      if (this.get('channel') === channel && this.get('playing')) {
        this.set('playing', false);
        this.trigger('pause');
      } else {
        this.set({'channel': channel, 'playing': true});
        this.trigger('play');
      }
    },

    /**
     * Toggle between paused and playing.
     */
    pause: function() {
      // If it isn't playing anything
      if (this.get('channel') === null) {
        return;
      }
      // Toggle playing status
      this.set('playing', !this.get('playing'));
      if (this.get('playing')) {
        this.trigger('play');
      } else {
        this.trigger('pause');
      }
    },
  });
})();
