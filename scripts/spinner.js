(function() {

  $.fn.spin = function(opts) {
    this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data();
      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend({
          color: $this.css('color')
        }, opts);
        return data.spinner = new Spinner(opts).spin(this);
      }
    });
    return this;
  };

  this.showSpinner = function($container) {
    var $spinner;
    $spinner = $container.find('.spinner');
    if (!$spinner.size()) {
      $spinner = $('<div class="spinner"></div>').appendTo($container.addClass('spinner-container')).spin().hide();
    }
    return $spinner.fadeIn('fast');
  };

  this.hideSpinner = function($container) {
    return $container.find('.spinner').fadeOut('fast');
  };

}).call(this);
