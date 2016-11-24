(function() {

  $('.screenshots').wrapInner('<div class="slides_container"></div>').css('visibility', 'visible').slides({
    effect: 'fade',
    crossfade: true,
    fadeSpeed: 500,
    play: 2500
  });

}).call(this);
