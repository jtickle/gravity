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

module.exports = function() {
  var _this = this;
  var active = false;

  this.kbd = {
    shift: false,
    alt: false,
    ctrl: false
  }

  this.mouse = {
    x: 0,
    y: 0,
    w: 0,
    m: 0,
    l: false,
    m: false,
    r: false,
  };

  this.touch = {
    touches: {},
    average: null
  };

  var setButton = function(num, state) {
    switch(num) {
      case 0: _this.mouse.l = state; break;
      case 1: _this.mouse.m = state; break;
      case 2: _this.mouse.r = state; break;
    }
  }

  var onMouseDown = function(e) {
    setButton(e.button, true);
  }

  var onMouseUp = function(e) {
    setButton(e.button, false);
  }

  var onMouseMove = function(e) {
    _this.mouse.x = e.clientX;
    _this.mouse.y = e.clientY;
  }

  var onWheel = function(e) {
    _this.mouse.w = e.deltaY;
    _this.mouse.m = e.deltaMode;
  }

  var updateTouchData = function(e) {
    e.preventDefault();
    var myT = _this.touch.touches;
    var evT = e.touches;

    // Clear the touch list
    Object.keys(myT).map(function(v, i) {
      delete myT[v];
    });

    var avgX = 0;
    var avgY = 0;
    var cnt  = 0;

    // Add current touches
    for(var i in evT) {
      var t = evT[i];
      if(typeof(t) != 'object') continue;

      myT[t.identifier] = {
        x: t.clientX,
        y: t.clientY
      };

      avgX += t.clientX;
      avgY += t.clientY;
      cnt  ++;
    }
    
    if(!cnt) {
      _this.touch.average = null;
    } else {
      _this.touch.average = {
        x: avgX / cnt,
        y: avgY / cnt
      };
    }
  }

  this.activate = function(el) {
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("wheel", onWheel);
    el.addEventListener("touchstart", updateTouchData);
    el.addEventListener("touchmove", updateTouchData);
    el.addEventListener("touchend", updateTouchData);
    el.addEventListener("touchcancel", updateTouchData);
  }

  this.deactivate = function(el) {
    el.removeEventListener("mousedown", onMouseDown);
    el.removeEventListener("mouseup", onMouseUp);
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("wheel", onWheel);
    el.removeEventListener("touchstart", updateTouchData);
    el.removeEventListener("touchmove", updateTouchData);
    el.removeEventListener("touchend", updateTouchData);
    el.removeEventListener("touchcancel", updateTouchData);
  }
}
