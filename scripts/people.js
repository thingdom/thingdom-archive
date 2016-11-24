(function() {
  var $peopleUL, $persons, $sort, currentSort, i, initialSort, person, personOffsets, resort, _i, _len, _ref;

  if (!Modernizr.history) {
    return;
  }

  $sort = $('#people-sort-select');

  $peopleUL = $('ul.people');

  $persons = $peopleUL.find('li.person');

  initialSort = $sort.val();

  currentSort = initialSort;

  $peopleUL.css('position', 'relative').height($peopleUL.height());

  personOffsets = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = $persons.length; _i < _len; _i++) {
      person = $persons[_i];
      _results.push($(person).position().top);
    }
    return _results;
  })();

  for (i = _i = 0, _len = $persons.length; _i < _len; i = ++_i) {
    person = $persons[i];
    $(person).css({
      position: 'absolute',
      left: 0,
      top: personOffsets[i]
    });
  }

  resort = function(sort) {
    if (sort === currentSort) {
      return;
    }
    currentSort = sort;
    $persons.sort((function() {
      switch (sort) {
        case 'followers':
          return function(a, b) {
            return $(b).data('num-followers') - $(a).data('num-followers');
          };
        case 'things':
          return function(a, b) {
            return $(b).data('num-things') - $(a).data('num-things');
          };
        case 'newest':
          return function(a, b) {
            return $(b).data('created') - $(a).data('created');
          };
        case 'recommended':
          return function(a, b) {
            var $a, $b;
            $a = $(a);
            $b = $(b);
            if ($b.data('is-current-user')) {
              return -1;
            }
            if ($a.data('is-current-user')) {
              return 1;
            }
            return ($b.data('followed-by-current-user') ? -1 : 0) - ($a.data('followed-by-current-user') ? -1 : 0) || ($b.data('num-followers-current-user-follows') || 0) - ($a.data('num-followers-current-user-follows') || 0);
          };
      }
    })());
    return $persons.appendTo($peopleUL).each(function(i, person) {
      return $(person).animate({
        top: personOffsets[i]
      }, 'slow');
    });
  };

  if ((_ref = $sort[0]) != null) {
    _ref.onchange = null;
  }

  $sort.change(function(event) {
    var sort;
    sort = $sort.val();
    resort(sort);
    return history.pushState(null, null, "?sort=" + sort);
  });

  $(window).bind('popstate', function(event) {
    var sort;
    sort = location.search.replace('?sort=', '') || initialSort;
    resort(sort);
    return $sort.val(sort);
  });

}).call(this);
