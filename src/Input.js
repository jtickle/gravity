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

module.exports = function(sq, rq) {
  var _this = this;
  var active = false;

  this.kbd = {
    mod: {
      shift: false,
      alt: false,
      ctrl: false
    }
  };

  this.mouse = {
    x: 0,
    y: 0,
    w: 0,
    m: 0,
    l: false,
    m: false,
    r: false,
    a: false,
    b: false
  };

  this.touch = {
    touches: {},
    average: null
  };

  var updateKeyboardData = function(e) {
    var k = _this.kbd.mod;
    k.alt       = e.getModifierState('Alt');
    k.altgraph  = e.getModifierState('AltGraph');
    k.capslock  = e.getModifierState('CapsLock');
    k.control   = e.getModifierState('Control');
    k.fn        = e.getModifierState('Fn');
    k.meta      = e.getModifierState('Meta');
    k.NumLock   = e.getModifierState('NumLock');
    k.os        = e.getModifierState('OS');
    k.scolllock = e.getModifierState('ScrollLock');
    k.shift     = e.getModifierState('Shift');
  }

  var updateMouseData = function(e) {
    var m = _this.mouse;

    m.x = e.clientX;
    m.y = e.clientY;
    m.l = !!(e.buttons & 1);
    m.m = !!(e.buttons & 4);
    m.r = !!(e.buttons & 2);
    m.a = !!(e.buttons & 8);
    m.b = !!(e.buttons & 16);
    updateKeyboardData(e);
  }

  var moveViewport = function(e, m) {
    rq.q('pan', e.clientX - m.x, e.clientY - m.y);
  }

  var onMouseDown = function(e) {
    var m = _this.mouse;
    if(m.l) {
      moveViewport(e, m);
      document.body.style.cursor = 'move';
    }

    updateMouseData(e);
  }

  var onMouseUp = function(e) {
    var m = _this.mouse;
    if(m.l) {
      moveViewport(e, m);
      document.body.style.cursor = 'default';
    }

    updateMouseData(e);
  }

  var onMouseMove = function(e) {
    var m = _this.mouse;
    if(m.l) {
      moveViewport(e, m);
    }

    updateMouseData(e);
  }

  var onWheel = function(e) {
    _this.mouse.w = e.deltaY;
    _this.mouse.m = e.deltaMode;
  };

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
  };

  var doListeners = function(fn) {
    fn("mousedown",   onMouseDown);
    fn("mouseup",     onMouseUp);
    fn("mousemove",   onMouseMove);
    fn("wheel",       onWheel);
    fn("touchstart",  updateTouchData);
    fn("touchmove",   updateTouchData);
    fn("touchend",    updateTouchData);
    fn("touchcancel", updateTouchData);
  };

  this.activate = function(el) {
    doListeners(el.addEventListener);
  };

  this.deactivate = function(el) {
    doListeners(el.removeEventListener);
  };
}
