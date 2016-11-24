var ui = {};

;(function(exports){

/**
 * Expose `Emitter`.
 */

exports.Emitter = Emitter;

/**
 * Initialize a new `Emitter`.
 * 
 * @api public
 */

function Emitter() {
  this.callbacks = {};
};

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  (this.callbacks[event] = this.callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = function(event, fn){
  var callbacks = this.callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this.callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn);
  callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter} 
 */

Emitter.prototype.emit = function(event){
  var args = [].slice.call(arguments, 1)
    , callbacks = this.callbacks[event];

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this;
};

})(ui);
;(function(exports, html){

/**
 * Active dialog.
 */

var active;

/**
 * Expose `Dialog`.
 */

exports.Dialog = Dialog;

/**
 * Return a new `Dialog` with the given 
 * (optional) `title` and `msg`.
 *
 * @param {String} title or msg
 * @param {String} msg
 * @return {Dialog}
 * @api public
 */

exports.dialog = function(title, msg){
  switch (arguments.length) {
    case 2:
      return new Dialog({ title: title, message: msg });
    case 1:
      return new Dialog({ message: title });
  }
};

/**
 * Initialize a new `Dialog`.
 *
 * Options:
 *
 *    - `title` dialog title
 *    - `message` a message to display
 *
 * Emits:
 *
 *    - `show` when visible
 *    - `hide` when hidden
 *
 * @param {Object} options
 * @api public
 */

function Dialog(options) {
  ui.Emitter.call(this);
  options = options || {};
  this.template = html;
  this.el = $(this.template);
  this.render(options);
  if (active) active.hide();
  if (Dialog.effect) this.effect(Dialog.effect);
  active = this;
};

/**
 * Inherit from `Emitter.prototype`.
 */

Dialog.prototype = new ui.Emitter;

/**
 * Render with the given `options`.
 *
 * @param {Object} options
 * @api public
 */

Dialog.prototype.render = function(options){
  var el = this.el
    , title = options.title
    , msg = options.message
    , self = this;

  el.find('.close').click(function(){
    self.emit('close');
    self.hide();
    return false;
  });

  el.find('h1').text(title);
  if (!title) el.find('h1').remove();

  // message
  if ('string' == typeof msg) {
    el.find('p').text(msg);
  } else if (msg) {
    el.find('p').replaceWith(msg.el || msg);
  }

  setTimeout(function(){
    el.removeClass('hide');
  }, 0);
};

/**
 * Enable the dialog close link.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.closable = function(){
  this.el.addClass('closable');
  return this;
};

/**
 * Set the effect to `type`.
 *
 * @param {String} type
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.effect = function(type){
  this._effect = type;
  this.el.addClass(type);
  return this;
};

/**
 * Make it modal!
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.modal = function(){
  this._overlay = ui.overlay();
  return this;
};

/**
 * Add an overlay.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.overlay = function(){
  var self = this;
  this._overlay = ui
    .overlay({ closable: true })
    .on('hide', function(){
      self.closedOverlay = true;
      self.hide();
    });
  return this;
};

/**
 * Close the dialog when the escape key is pressed.
 *
 * @api private
 */

Dialog.prototype.escapable = function(){
  var self = this;
  $(document).bind('keydown.dialog', function(e){
    if (27 != e.which) return;
    $(this).unbind('keydown.dialog');
    self.hide();
  });
};

/**
 * Show the dialog.
 *
 * Emits "show" event.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.show = function(){
  var overlay = this._overlay;

  this.emit('show');

  if (overlay) {
    overlay.show();
    this.el.addClass('modal');
  }

  // escape
  if (!overlay || overlay.closable) this.escapable();

  this.el.appendTo('body');
  this.el.css({ marginLeft: -(this.el.width() / 2) + 'px' });
  return this;
};

/**
 * Hide the dialog with optional delay of `ms`,
 * otherwise the dialog is removed immediately.
 *
 * Emits "hide" event.
 *
 * @return {Number} ms
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.hide = function(ms){
  var self = this;
  this.emit('hide');

  // duration
  if (ms) {
    setTimeout(function(){
      self.hide();
    }, ms);
    return this;
  }

  // hide / remove
  this.el.addClass('hide');
  if (this._effect) {
    setTimeout(function(self){
      self.remove();
    }, 500, this);
  } else {
    self.remove();
  }

  // modal
  if (this._overlay && !self.closedOverlay) this._overlay.hide();

  return this;
};

/**
 * Hide the dialog without potential animation.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.remove = function(){
  this.el.remove();
  return this;
};

})(ui, "<div id=\"dialog\" class=\"hide\">\n  <div class=\"content\">\n    <h1>Title</h1>\n    <a href=\"#\" class=\"close\">×</a>\n    <p>Message</p>\n  </div>\n</div>");
;(function(exports, html){

/**
 * Expose `Overlay`.
 */

exports.Overlay = Overlay;

/**
 * Return a new `Overlay` with the given `options`.
 *
 * @param {Object} options
 * @return {Overlay}
 * @api public
 */

exports.overlay = function(options){
  return new Overlay(options);
};

/**
 * Initialize a new `Overlay`.
 *
 * @param {Object} options
 * @api public
 */

function Overlay(options) {
  ui.Emitter.call(this);
  var self = this;
  options = options || {};
  this.closable = options.closable;
  this.el = $(html);
  this.el.appendTo('body');
  if (this.closable) {
    this.el.click(function(){
      self.hide();
    });
  }
}

/**
 * Inherit from `Emitter.prototype`.
 */

Overlay.prototype = new ui.Emitter;

/**
 * Show the overlay.
 *
 * Emits "show" event.
 *
 * @return {Overlay} for chaining
 * @api public
 */

Overlay.prototype.show = function(){
  this.emit('show');
  this.el.removeClass('hide');
  return this;
};

/**
 * Hide the overlay.
 *
 * Emits "hide" event.
 *
 * @return {Overlay} for chaining
 * @api public
 */

Overlay.prototype.hide = function(){
  var self = this;
  this.emit('hide');
  this.el.addClass('hide');
  setTimeout(function(){
    self.el.remove();
  }, 2000);
  return this;
};

})(ui, "<div id=\"overlay\" class=\"hide\"></div>");
;(function(exports, html){

/**
 * Expose `Confirmation`.
 */

exports.Confirmation = Confirmation;

/**
 * Return a new `Confirmation` dialog with the given 
 * `title` and `msg`.
 *
 * @param {String} title or msg
 * @param {String} msg
 * @return {Dialog}
 * @api public
 */

exports.confirm = function(title, msg){
  switch (arguments.length) {
    case 2:
      return new Confirmation({ title: title, message: msg });
    case 1:
      return new Confirmation({ message: title });
  }
};

/**
 * Initialize a new `Confirmation` dialog.
 *
 * Options:
 *
 *    - `title` dialog title
 *    - `message` a message to display
 *
 * Emits:
 *
 *    - `cancel` the user pressed cancel or closed the dialog
 *    - `ok` the user clicked ok
 *    - `show` when visible
 *    - `hide` when hidden
 *
 * @param {Object} options
 * @api public
 */

function Confirmation(options) {
  ui.Dialog.call(this, options);
};

/**
 * Inherit from `Dialog.prototype`.
 */

Confirmation.prototype = new ui.Dialog;

/**
 * Change "cancel" button `text`.
 *
 * @param {String} text
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.cancel = function(text){
  this.el.find('.cancel').text(text);
  return this;
};

/**
 * Change "ok" button `text`.
 *
 * @param {String} text
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.ok = function(text){
  this.el.find('.ok').text(text);
  return this;
};

/**
 * Show the confirmation dialog and invoke `fn(ok)`.
 *
 * @param {Function} fn
 * @return {Confirmation} for chaining
 * @api public
 */

Confirmation.prototype.show = function(fn){
  ui.Dialog.prototype.show.call(this);
  this.el.find('.ok').focus();
  this.callback = fn || function(){};
  return this;
};

/**
 * Render with the given `options`.
 *
 * Emits "cancel" event.
 * Emits "ok" event.
 *
 * @param {Object} options
 * @api public
 */

Confirmation.prototype.render = function(options){
  ui.Dialog.prototype.render.call(this, options);
  var self = this
    , actions = $(html);

  this.el.addClass('confirmation');
  this.el.append(actions);

  this.on('close', function(){
    self.emit('cancel');
    self.callback(false);
  });

  actions.find('.cancel').click(function(e){
    e.preventDefault();
    self.emit('cancel');
    self.callback(false);
    self.hide();
  });

  actions.find('.ok').click(function(e){
    e.preventDefault();
    self.emit('ok');
    self.callback(true);
    self.hide();
  });
};

})(ui, "<div class=\"actions\">\n  <button class=\"cancel\">Cancel</button>\n  <button class=\"ok main\">Ok</button>\n</div>");