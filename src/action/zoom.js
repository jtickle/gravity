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
  var _this = this;
  var log = new Logger('action/zoom');
  var pinching = false;
  var lastV = null;

  var hammer = new Hammer(renderer.view);

  var onWheel = function(e) {
    log('onWheel', e);
    renderer.updateCursor(e.clientX, e.clientY);
    renderer.applyScaleFactor(e.deltaY / 1000);
  }

  var getPinchStats = function(e) {
    var v = {};
    v.x0 = e.touches[0].clientX;
    v.x1 = e.touches[1].clientX;
    v.y0 = e.touches[0].clientY;
    v.y1 = e.touches[1].clientY;
    var derp;

    if(v.x0 > v.x1) {
      derp = v.x0;
      v.x0 = v.x1;
      v.x1 = derp;
    }

    if(v.y0 > v.y1) {
      derp = v.y0;
      v.y0 = v.y1;
      v.y1 = derp;
    }

    v.dx = (v.x1 - v.x0);
    v.dy = (v.y1 - v.y0);

    v.centerX = (v.dx / 2) + v.x0;
    v.centerY = (v.dy / 2) + v.y0;

    v.r = Math.sqrt(v.dx*v.dx + v.dy*v.dy);

    for(var i in Object.keys(v)) {
      simulation.debug['actionZoom'+i] = v[i];
    }

    return v;
  }

  var onTouchMove = function(e) {
    if(!pinching){
      if(e.touches.length == 2) {
        pinching = true;
        lastV = getPinchStats(e);
      } else return;
    }

    if(e.touches.length == 1) {
      pinching = false;
      if(lastV) {
        for(var i in Object.keys(lastV)) {
          delete simulation.debug['actionZoom'+i];
        }
        lastV = null;
      }
      delete simulation.debug.actionZoomType;
      return;
    }
    
    var v = getPinchStats(e);

    renderer.updateCursor(v.centerX, v.centerY);
    renderer.applyScaleFactor(v.r - lastV.r);

    lastV = v;
  }

  this.activate = function() {
    if(active) return;
    renderer.view.addEventListener("wheel", onWheel);
    renderer.view.addEventListener("touchmove", onTouchMove);
    active = true;
  }

  this.deactivate = function() {
    if(!active) return;
    renderer.view.removeEventListener("wheel", onWheel);
    renderer.view.removeEventListener("touchmove", onTouchMove);
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
