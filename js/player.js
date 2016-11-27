
function Player() {
  this.lastAction = 0;
  this.isIdle = true;
}

Player.actions = {
  IDLE: 0,
  JUMP: 38,  // keycode for up
  DUCK: 40   // keycode for down
};

Player.prototype.do = function(action) {

  if (action == Player.actions.JUMP || action == Player.actions.DUCK) {

    if (this.isIdle) this.isIdle = false;
    else if (this.lastAction != action) this._releaseKey(this.lastAction);

    this._pressKey(action);
    this.lastAction = action;

  } else {  // IDLE

    if (!this.isIdle) {

      this._releaseKey(this.lastAction);

      this.isIdle = true;
      this.lastAction = Player.actions.IDLE;

    }

  }

};

Player.prototype._pressKey = function(keyCode) {
  this._setKeyPressed(keyCode, true);
};

Player.prototype._releaseKey = function(keyCode) {
  this._setKeyPressed(keyCode, false);
};

Player.prototype._setKeyPressed = function(keyCode, pressed) {
  var event = new Event(pressed ? 'keydown' : 'keyup');
  event.keyCode = keyCode;
  event.which = event.keyCode;
  event.altKey = false;
  event.ctrlKey = true;
  event.shiftKey = false;
  event.metaKey = false;
  document.dispatchEvent(event);
};
