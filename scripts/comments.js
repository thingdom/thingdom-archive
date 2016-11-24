(function() {
  var deleteComment, disable, enable, isDisabled;

  disable = function($form) {
    $form.find('input').attr('disabled', 'disabled');
    return $form.data('disabled', true);
  };

  enable = function($form) {
    $form.find('input').removeAttr('disabled');
    return $form.data('disabled', false);
  };

  isDisabled = function($form) {
    return $form.data('disabled');
  };

  $('form.comment').submit(function(event) {
    var $form, $input, id, message, url;
    event.preventDefault();
    $form = $(this);
    if (isDisabled($form)) {
      return;
    }
    $input = $form.find('input.comment');
    id = $input.data('id');
    message = $input.val();
    url = "/api/" + id + "/comments";
    disable($form);
    showSpinner($form);
    return $.ajax({
      url: url,
      type: 'POST',
      data: {
        message: message
      },
      error: function(jqXHR, textStatus, errorThrown) {
        handleError(errorThrown);
        enable($form);
        return hideSpinner($form);
      },
      success: function(html, textStatus, jqXHR) {
        var $comment;
        enable($form);
        hideSpinner($form);
        $input.val('');
        $comment = $(html).filter('li.comment').insertBefore($form.closest('li')).hide().slideDown();
        return $comment.find('time.timeago').timeago();
      }
    });
  });

  $('.close-button').live('click', function(event) {
    var elmt;
    elmt = this;
    return confirmAsync({
      title: 'Confirm',
      message: 'Are you sure you want to delete this comment?',
      ok: 'Delete',
      cancel: 'Don’t delete'
    }, function(ok) {
      if (ok) {
        return deleteComment(elmt);
      }
    });
  });

  deleteComment = function(elmt) {
    var $comment, id, url;
    $comment = $(elmt).closest('.comment');
    id = $comment.data('id');
    url = "/api/comments/" + id;
    showSpinner($comment);
    return $.ajax({
      url: url,
      type: 'POST',
      data: {
        _method: 'DELETE'
      },
      error: function(jqXHR, textStatus, errorThrown) {
        handleError(errorThrown);
        return hideSpinner($comment);
      },
      success: function(data, textStatus, jqXHR) {
        hideSpinner($comment);
        return $comment.slideUp(function() {
          return $comment.remove();
        });
      }
    });
  };

}).call(this);
