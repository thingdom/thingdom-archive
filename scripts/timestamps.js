(function() {

  $.fn.timeago_orig = $.fn.timeago;

  $.fn.timeago = function() {
    return this.timeago_orig().each(function(i, time) {
      var date;
      date = new Date(time.title);
      return $(time).attr('title', "" + (date.toLocaleDateString()) + " at " + (date.toLocaleTimeString()));
    });
  };

  $('time.timeago').timeago();

}).call(this);
