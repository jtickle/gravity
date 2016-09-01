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
    pinch: null,
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

  var mouseMoveViewport = function(e, m) {
    rq.q('pan', e.clientX - m.x, e.clientY - m.y);
  }

  var onMouseDown = function(e) {
    var m = _this.mouse;
    if(e.buttons & 1) {
      document.body.style.cursor = 'move';
    }

    updateMouseData(e);
  }

  var onMouseUp = function(e) {
    var m = _this.mouse;
    if(e.buttons & 1) {
      mouseMoveViewport(e, m);
      document.body.style.cursor = 'default';
    }

    updateMouseData(e);
  }

  var onMouseMove = function(e) {
    var m = _this.mouse;
    if(m.l) {
     mouseMoveViewport(e, m);
    }

    updateMouseData(e);
    rq.q('updateCursor', e.clientX, e.clientY);
  }

  var onWheel = function(e) {
    _this.mouse.w = e.deltaY;
    _this.mouse.m = e.deltaMode;
    rq.q('updateCursor', e.clientX, e.clientY);
    rq.q('zoom', e.deltaY / 1000);
  };

  var updateTouchData = function(e) {
    e.preventDefault();
    var myT = {};
    var evT = e.touches;
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

    _this.touch.touches = myT;
    
    // Calculate average position
    if(!cnt) {
      _this.touch.average = null;
    } else {
      _this.touch.average = {
        x: avgX / cnt,
        y: avgY / cnt
      };
    }

    // Set Pinch Data, if available
    if(e.touches.length == 2) {
      var pinch = {};
      var swap;

      pinch.x0 = e.touches[0].clientX;
      pinch.x1 = e.touches[1].clientX;
      pinch.y0 = e.touches[0].clientY;
      pinch.y1 = e.touches[1].clientY;

      pinch.dx = Math.abs(pinch.x0 - pinch.x1) / 2;
      pinch.dy = Math.abs(pinch.y0 - pinch.y1) / 2;

      pinch.r = Math.sqrt(pinch.dx*pinch.dx + pinch.dy*pinch.dy);

      _this.touch.pinch = pinch;
    } else {
      _this.touch.pinch = null;
    }
  };

  var onTouchStart = function(e) {
    e.preventDefault();
    updateTouchData(e);
  }

  var onTouchMove = function(e) {
    e.preventDefault();
    var pp = _this.touch.pinch;
    var pa = _this.touch.average;
    updateTouchData(e);
    var np = _this.touch.pinch;
    var na = _this.touch.average;

    if(e.touches.length > 0) {
      rq.q('updateCursor', na.x, na.y);
      if(e.touches.length > 1) {
        rq.q('zoom', (np.r - pp.r) / -100);
      }
      rq.q('pan', na.x - pa.x, na.y - pa.y);
    }
  }

  var doListeners = function(fn) {
    fn("mousedown",   onMouseDown);
    fn("mouseup",     onMouseUp);
    fn("mousemove",   onMouseMove);
    fn("wheel",       onWheel);
    fn("touchstart",  onTouchStart);
    fn("touchmove",   onTouchMove);
    fn("touchend",    onTouchMove);
    fn("touchcancel", onTouchMove);
  };

  this.activate = function(el) {
    doListeners(el.addEventListener);
  };

  this.deactivate = function(el) {
    doListeners(el.removeEventListener);
  };
}
