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
  this.nearest = null;
  this.active = false;
  var _this = this;

  var onMouseMove = function(e) {
    _this.x = e.clientX;
    _this.y = e.clientY;
  }

  var onMouseOver = function(e) {
    _this.mouseOver = true;
  }

  var onMouseOut = function(e) {
    _this.mouseOver = false;
  }

  var onClick = function(e) {
    if(!_this.nearest) return;
    simulation.toggleSelected(_this.nearest);
  }

  this.activate = function() {
    if(this.active) return;

    renderer.view.addEventListener("mousemove", onMouseMove);
    renderer.view.addEventListener("mouseenter", onMouseOver);
    renderer.view.addEventListener("mouseleave", onMouseOut);
    renderer.view.addEventListener("click", onClick);
    this.active = true;
  }

  this.deactivate = function() {
    if(!this.active) return;

    renderer.view.removeEventListener("mousemove", onMouseMove);
    renderer.view.removeEventListener("mouseenter", onMouseOver);
    renderer.view.removeEventListener("mouseleave", onMouseOut);
    renderer.view.removeEventListener("click", onClick);
    this.active = false;
  }

  this.mutate = function() {
    // This would be better done with like an octree, in fact that
    // could provide performance improvements all around TODO
    var stars = simulation.stars;

    var minimum = Number.MAX_SAFE_INTEGER;

    stars.forEach(function(cur, idx, arr) {
      var distance = Math.sqrt(Math.pow(cur.x - renderer.screenToX(_this.x), 2) +
                               Math.pow(cur.y - renderer.screenToY(_this.y), 2));
      if(distance < minimum) {
        _this.nearest = cur;
        minimum = distance;
      }
    });
  }

  this.render = function() {
    var ctx = renderer.ctx;

    // If mouse is not over or nearest has not yet been set, don't draw a line
    if(!this.mouseOver) return;
    if(!this.nearest) return;

    // Draw line from cursor to nearest star
    var x1 = _this.x;
    var y1 = _this.y;
    var x2 = renderer.XToScreen(_this.nearest.x);
    var y2 = renderer.YToScreen(_this.nearest.y);

    // Green for 'will be selected'; Red for 'will be unselected'
    if(simulation.isSelected(_this.nearest)) {
      ctx.strokeStyle = '#990000';
    } else {
      ctx.strokeStyle = '#009900';
    }
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();

  }
}
