var app = app || {};

(function($) {
  app.AppView = Backbone.View.extend({
    el: '#app',
    initialize: function() {
      console.log('12312231');
      this.render();
    },
    render: function() {
      console.log('123');
      this.$el.html('kalle');
    }
  });
})(jQuery);
