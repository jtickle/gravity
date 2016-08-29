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
  var lastscale = 0;
  var pinching = false;

  var hammer = new Hammer(renderer.view);

  var onWheel = function(e) {
    log('onWheel', e);
    renderer.updateCursor(e.clientX, e.clientY);
    renderer.applyScaleFactor(e.deltaY / 1000);
  }

  var onPinchStart = function(e) {
    pinching = true;
    lastscale = e.scale;
    simulation.debug.actionZoomType = "touch";
    simulation.debug.actionZoomDs = 0;
  }

  var onPinchMove = function(e) {
    if(!pinching) return;
    renderer.updateCursor(e.center.x, e.center.y);
    renderer.applyScaleFactor(e.scale - lastscale);

    simulation.debug.actionZoomDs = e.scale - lastscale;

    lastscale = e.scale
  }

  var onPinchEnd = function(e) {
    lastscale = 0;
    pinching = false;

    delete simulation.debug.actionZoomType;
    delete simulation.debug.actionSoomDs;
  }

  this.activate = function() {
    if(active) return;
    renderer.view.addEventListener("wheel", onWheel);
    hammer.on("pinchstart", onPinchStart);
    hammer.on("pinchmove", onPinchMove);
    hammer.on("pinchend", onPinchEnd);
    hammer.on("pinchcancel", onPinchEnd);
    active = true;
  }

  this.deactivate = function() {
    if(!active) return;
    renderer.view.removeEventListener("wheel", onWheel);
    hammer.off("pinchstart", onPinchStart);
    hammer.off("pinchmove", onPinchMove);
    hammer.off("pinchend", onPinchEnd);
    hammer.off("pinchcancel", onPinchEnd);
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
