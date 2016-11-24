(function() {

  $('form.search').each(function() {
    var $autocompleteUL, $searchForm, $searchInput, name, type, value, _i, _len, _ref, _ref1;
    $searchForm = $(this);
    type = 'things';
    _ref = $searchForm.serializeArray();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i], name = _ref1.name, value = _ref1.value;
      if (name === 'type') {
        type = value;
        break;
      }
    }
    $searchForm.find('input[name="type"]').live('change', function() {
      return type = this.value;
    });
    $searchInput = $searchForm.find('input[name="q"]').autocomplete({
      autoFocus: true,
      delay: 0,
      select: function(event, ui) {
        $searchInput.val(ui.item.value);
        return $searchForm.submit();
      },
      source: function(request, response) {
        var begin, term;
        begin = Date.now();
        term = request.term;
        return $.ajax({
          url: (function() {
            switch (type) {
              case 'things':
                return 'http://completion.amazon.com/search/complete';
              case 'people':
                return '/api/users/autocomplete';
            }
          })(),
          type: 'GET',
          cache: false,
          dataType: (function() {
            switch (type) {
              case 'things':
                return 'jsonp';
              default:
                return 'json';
            }
          })(),
          success: function(data) {
            var prevBegin, suggestions;
            suggestions = (function() {
              switch (type) {
                case 'things':
                  return data[1];
                default:
                  return data;
              }
            })();
            prevBegin = $searchInput.data('ac-res-req-time');
            if (!prevBegin || begin > prevBegin) {
              response(suggestions);
              $searchInput.data('ac-res-req-time', begin);
              return $autocompleteUL.find('a').each(function() {
                var $a, html, i, match, pre, suggestion, termLower, text, textLower;
                $a = $(this);
                text = $a.text();
                textLower = text.toLowerCase();
                termLower = term.toLowerCase();
                switch (type) {
                  case 'things':
                    if (-1 === textLower.indexOf(termLower)) {
                      return;
                    }
                    suggestion = text.substring(term.length);
                    return $a.html("" + term + "<strong>" + suggestion + "</strong>");
                  case 'people':
                    html = '';
                    while (text) {
                      i = textLower.indexOf(termLower);
                      if (i === -1) {
                        html += text;
                        text = '';
                      } else {
                        pre = text.slice(0, i);
                        match = text.slice(i, i + term.length);
                        html += "" + pre + "<strong>" + match + "</strong>";
                        text = text.slice(i + term.length);
                        textLower = text.toLowerCase();
                      }
                    }
                    return $a.html(html);
                }
              });
            }
          },
          data: (function() {
            switch (type) {
              case 'things':
                return {
                  q: request.term,
                  'search-alias': 'aps',
                  mkt: '1',
                  callback: '?'
                };
              case 'people':
                return {
                  q: request.term
                };
            }
          })()
        });
      }
    });
    return $autocompleteUL = $searchInput.autocomplete('widget');
  });

}).call(this);
