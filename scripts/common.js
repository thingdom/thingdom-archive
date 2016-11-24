(function() {
  var $hiddenInput, $hiddenInputs, $searchFieldset, $searchForm, $searchTextbox, TIPSY_SEARCH_CLASS, getClass, name, value, _i, _len, _ref, _ref1;

  $('input, textarea').placeholder();

  $('form.search').submit(function(input) {
    var $input;
    $input = $(this).find('input[name="q"]');
    if (!$input.val()) {
      return $input.val($input.attr('placeholder').replace('E.g. ', ''));
    }
  });

  $('abbr').live('click', function(abbr) {
    if (this.title) {
      return alert({
        title: 'Info',
        message: this.title
      });
    }
  });

  $('input[type=submit]').live('click', function(event) {
    var $form;
    if (event.which > 1 || event.metaKey || event.shiftKey) {
      $form = $(this).closest('form');
      if (!$form.attr('target')) {
        $form.attr('target', '_blank');
        return setTimeout(function() {
          return $form.removeAttr('target');
        }, 0);
      }
    }
  });

  this.alert = function(opts) {
    if (typeof opts === 'string') {
      opts = {
        message: opts
      };
    }
    return ui.confirm(opts.title || 'Alert', opts.message).ok(opts.ok || 'OK').cancel('').closable().overlay().show();
  };

  this.handleError = function(logMsg) {
    console.warn(logMsg);
    return alert({
      title: 'Error',
      message: 'Sorry, we encountered an error. Please try reloading the page.'
    });
  };

  this.confirmAsync = function(opts, callback) {
    if (typeof opts === 'string') {
      opts = {
        message: opts
      };
    }
    return ui.confirm(opts.title || 'Confirm', opts.message).ok(opts.ok || 'OK').cancel(opts.cancel || 'Cancel').closable().overlay().show(function(ok) {
      return callback(ok);
    });
  };

  $(function() {
    $('select.chosen').each(function() {
      var $this;
      $this = $(this);
      return $this.chosen({
        allow_single_deselect: true,
        no_results_text: $this.data('no-results-text')
      });
    });
    return $('.chzn-container').live('keydown', function(event) {
      var $chosen, $dropdown;
      $chosen = $(this);
      $dropdown = $chosen.find('.chzn-drop');
      if ((event.which === 13 || event.keyCode === 13) && $dropdown.offset().left < 0) {
        return $chosen.closest('form').find('input[type=submit]').click();
      }
    });
  });

  if (!Modernizr.touch) {
    getClass = function(elmt) {
      var $elmt;
      $elmt = $(elmt);
      if ($elmt.hasClass('thing')) {
        return 'thing';
      } else if ($elmt.hasClass('user')) {
        return 'user';
      } else {
        return '';
      }
    };
    $('[rel=tipsy]').tipsy({
      live: true,
      className: function() {
        var className, classNames;
        classNames = this.className.split(' ');
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = classNames.length; _i < _len; _i++) {
            className = classNames[_i];
            _results.push("tipsy-" + className);
          }
          return _results;
        })()).join(' ');
      },
      gravity: function() {
        switch (getClass(this)) {
          case 'thing':
            return 'n';
          case 'user':
            return 's';
          default:
            return 'n';
        }
      },
      offset: function() {
        switch (getClass(this)) {
          case 'thing':
            return -60;
          default:
            return 0;
        }
      }
    });
  }

  TIPSY_SEARCH_CLASS = 'tipsy-search-options';

  $searchForm = $('header form.search');

  $searchTextbox = $searchForm.find('input[name=q]');

  $searchFieldset = $searchForm.find('fieldset');

  $hiddenInputs = {};

  _ref = $searchFieldset.find('input').serializeArray();
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    _ref1 = _ref[_i], name = _ref1.name, value = _ref1.value;
    $hiddenInput = $("<input type='hidden' name='" + name + "' value='" + value + "'>");
    $hiddenInputs[name] = $hiddenInput;
    $searchForm.append($hiddenInput);
  }

  $searchFieldset.remove();

  $("." + TIPSY_SEARCH_CLASS + " fieldset input").live('change', function() {
    $hiddenInputs[this.name].val(this.value);
    return $hiddenInputs[this.name].change();
  });

  $searchTextbox.tipsy({
    gravity: 'w',
    trigger: 'focus',
    className: TIPSY_SEARCH_CLASS,
    html: true,
    title: function() {
      return '&nbsp;';
    }
  });

  $searchTextbox.focus(function() {
    var $container;
    $container = $("." + TIPSY_SEARCH_CLASS + " .tipsy-inner a");
    if ($container.html() === '&nbsp;') {
      $container.empty();
    }
    return $container.append($searchFieldset);
  });

  $searchForm.submit(function() {
    return $searchTextbox.focus();
  });

  $("." + TIPSY_SEARCH_CLASS + " fieldset").live('click', function() {
    return $searchTextbox.focus();
  });

}).call(this);
