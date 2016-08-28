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

module.exports = function(simulation, renderer) {
  var active = false;
  var _this = this;

  var onWheel = function(e) {
    var x = renderer.screenToX(e.clientX);
    var y = renderer.screenToY(e.clientY);
    var dx = (x - renderer.centerX) / renderer.getScale();
    var dy = (y - renderer.centerY) / renderer.getScale();
//    var r = Math.sqrt(dx*dx + dy*dy);
//    var theta = Math.atan(dy/dx);
//    console.log([x, y, dx, dy, theta]);
    renderer.addScaleBase(e.deltaY / 1000);
    renderer.centerX = x - (dx * renderer.getScale());
    renderer.centerY = y - (dy * renderer.getScale());
//    renderer.centerX = x - (r * Math.cos(theta)) / renderer.getScale();
//    renderer.centerY = y - (r * Math.sin(theta)) / renderer.getScale();
  }

  this.activate = function() {
    if(active) return;
    renderer.view.addEventListener("wheel", onWheel);
    active = true;
  }

  this.deactivate = function() {
    if(!active) return;
    renderer.view.removeEventListener("wheel", onWheel);
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
