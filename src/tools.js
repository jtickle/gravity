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

if (!GRAVITY) { GRAVITY = {}; }
if (!GRAVITY.toolsreg) { GRAVITY.toolsreg = {}; }

GRAVITY.toolsreg.selectNearest = function(simulation, renderer, ui) {
  this.nearest = null;
  this.selected = null;
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
    _this.selected = _this.nearest;
  }

  this.activate = function() {
    renderer.view.addEventListener("mousemove", onMouseMove);
    renderer.view.addEventListener("mouseenter", onMouseOver);
    renderer.view.addEventListener("mouseleave", onMouseOut);
    renderer.view.addEventListener("click", onClick);
  }

  this.deactivate = function() {
    renderer.view.removeEventListener("mousemove", onMouseMove);
    renderer.view.removeEventListener("mouseenter", onMouseOver);
    renderer.view.removeEventListener("mouseleave", onMouseOut);
    renderer.view.removeEventListener("click", onClick);
    var herp = document.getElementById('derp');
    if(herp) {
      herp.parentNode.removeChild(herp);
    }
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
    if(!this.mouseOver) return;
    if(!this.nearest) return;
    var ctx = renderer.ctx;
    var x1 = _this.x;
    var y1 = _this.y;
    var x2 = renderer.XToScreen(this.nearest.x);
    var y2 = renderer.YToScreen(this.nearest.y);

    ctx.strokeStyle = '#009900';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();

    if(this.selected) {
      if(!this.uictl) {
        this.uictl = {
          id:   null,
          x:    null,
          y:    null,
          dx:   null,
          dy:   null,
          mass: null
        };

        ui.side.appendChild(ui.createTable('derp', this.uictl));
      }

      this.uictl.id.textContent = this.selected.id;
      this.uictl.x.textContent = this.selected.x;
      this.uictl.y.textContent = this.selected.y;
      this.uictl.dx.textContent = this.selected.dx;
      this.uictl.dy.textContent = this.selected.dy;
      this.uictl.mass.textContent = this.selected.m;

      var x = renderer.XToScreen(this.selected.x);
      var y = renderer.YToScreen(this.selected.y);

      ctx.strokeStyle = '#00CC00';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 10, y - 10, 20, 20);
      console.log([x,y]);
    }
  }
}

GRAVITY.tools = function(simulation, renderer, ui) {
  var activeTool;

  this.render = function() {
    if(activeTool == null) return;
    activeTool.mutate();
    activeTool.render();
  }

  this.moveActivated = function() {
    console.log("moveActivated");
  }

  this.moveDeactivated = function() {
    console.log("moveDeactivated");
  }

  this.moveScreenActivated = function () {
    activeTool = new GRAVITY.toolsreg.moveScreen(simulation, renderer, ui);
    activeTool.activate();
    console.log("moveScreenActivated");
  }

  this.moveScreenDeactivated = function() {
    activeTool.deactivate();
    activeTool = null;
    console.log("moveScreenDeactivated");
  }

  this.selectActivated = function() {
    console.log("selectActivated");
  }

  this.selectDeactivated = function() {
    console.log("selectDeactivated");
  }

  this.selectNearestActivated = function() {
    activeTool = new GRAVITY.toolsreg.selectNearest(simulation, renderer, ui);
    activeTool.activate();
    console.log("selectNearestActivated");
  }

  this.selectNearestDeactivated = function() {
    activeTool.deactivate();
    activeTool = null;
    console.log("selectNearestDeactivated");
  }

  this.insertActivated = function() {
    console.log("insertActivated");
  }

  this.insertDeactivated = function() {
    console.log("insertDeactivated");
  }

  this.insertOneActivated = function() {
    activeTool = new GRAVITY.toolsreg.insertOne(simulation, renderer, ui);
    activeTool.activate();
    console.log("insertOneActivated");
  }

  this.insertOneDeactivated = function() {
    activeTool.deactivate();
    activeTool = null;
    console.log("insertOneDeactivated");
  }
}
