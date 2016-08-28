/**
 * @licstart
 *
 * Copyright (C) 2016  Jeffrey W. Tickle
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */
"use strict";

var Hammer = require('hammerjs');
var Logger = require('logger');

module.exports = function(simulation, renderer) {
  var active = false;
  var mouseMoving = false;
  var touchMoving = false;
  var cursor = null;
  var _this = this;
  var log = new Logger('action/move');

  var hammer = new Hammer(renderer.view);

  var onMouseDown = function(e) {
    if(touchMoving) return;
    if(e.button != 2) return;

    log('onMouseDown', e);
    mouseMoving = true;
    cursor = document.body.style.cursor;
    document.body.style.cursor = 'move';
  }

  var onMouseUp = function(e) {
    if(touchMoving) return;
    if(e.button != 2) return;

    log('onMouseUp', e);
    mouseMoving = false;
    cursor = null;
    document.body.style.cursor = 'default';
  }

  var onMouseMove = function(e) {
    if(touchMoving) return;
    if(!mouseMoving) return;

    log('onMouseMove', e);
    renderer.pan(e.movementX, e.movementY);
  }

  var onPress = function(e) {
    log('onPress', e);
    touchMoving = true;
    renderer.updateCursor(e.touches[0].clientX, e.touches[0].clientY);
  }

  var onTouchMove = function(e) {
    if(!touchMoving) return;
    log('onTouchMove', e);
    renderer.pan(e.touches[0].clientX - renderer.lastX, e.touches[0].clientY - renderer.lastY);
    renderer.updateCursor(e.touches[0].clientX, e.touches[0].clientY);
  }

  var onTouchEnd = function(e) {
    log('onTouchEnd', e);
    touchMoving = false;
    renderer.updateCursor(e.touches[0].clientX, e.touches[0].clientY);
  }

  this.activate = function() {
    if(active) return;
    renderer.view.addEventListener("mousedown", onMouseDown);
    renderer.view.addEventListener("mousemove", onMouseMove);
    renderer.view.addEventListener("mouseup", onMouseUp);
    hammer.on('press', onPress);
    renderer.view.addEventListener("touchmove", onTouchMove);
    renderer.view.addEventListener("touchend", onTouchEnd);
    renderer.view.addEventListener("touchcancel", onTouchEnd);
    active = true;
  }

  this.deactivate = function() {
    if(!active) return;
    renderer.view.removeEventListener("mousedown", onMouseDown);
    renderer.view.removeEventListener("mousemove", onMouseMove);
    renderer.view.removeEventListener("mouseup", onMouseUp);
    hammer.off('press', onPress);
    renderer.view.removeEventListener("touchmove", onTouchMove);
    renderer.view.removeEventListener("touchend", onTouchEnd);
    renderer.view.removeEventListener("touchcancel", onTouchEnd);
    active = false;
  }

  this.isActive = function() {
    return active;
  }

  this.mutate = function() {
  }

  this.render = function() {
  }
}
