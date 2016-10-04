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

module.exports = function(bgColor, canvasId, debug) {
  // The width and height of the physical viewport
  var width, height;

  // The position in worldspace at which the center of the canvas points
  this.centerX = 0;
  this.centerY = 0;

  // The base scale setting (Integer from -inf to +inf where 0 = scale of 1:1
  // and negative gives you a wider perspective)
  var scaleBase = 0;

  // The computed scale setting Math.pow(Math.E, scaleBase)
  var scale = 1;

  // Cache of rendered stars
  var starCache = [];
    
  var view = document.getElementById(canvasId);
  var ctx = view.getContext('2d');
  this.view = view;
  this.ctx = ctx;

  this.lastX = 0;
  this.lastY = 0;
  
  var resizeSelf = function() {
    width  = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    view.getContext('2d').canvas.width = width;
    view.getContext('2d').canvas.height = height;
    debug.rendWidth = width;
    debug.rendHeight = height;
  };
  resizeSelf();

  var bgColor = '#000000';

  var _this = this;

  // Handle window resize gracefully
  window.addEventListener("resize", function() {
    resizeSelf();
    _this.blank();
  });

  this.blank = function() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  var setScaleBase = function(s) {
    scaleBase = s;
    scale = Math.pow(Math.E, scaleBase);
    debug.rScale = scale;
    debug.scaleBase = scaleBase;
  }

  var getScaleBase = function() {
    return scaleBase;
  }

  var getScale = function() {
    return scale;
  }

  this.setScaleBase = setScaleBase;
  this.getScaleBase = getScaleBase;
  this.getScale = getScale;

  var screenToX = function(screenX) {
    return ((screenX - (width / 2)) * scale) + _this.centerX;
  }
  var screenToY = function(screenY) {
    return ((screenY - (height / 2)) * scale) + _this.centerY;
  }

  var XToScreen = function(worldX) {
    return (width / 2) + ((worldX - _this.centerX) / scale);
  }
  var YToScreen = function(worldY) {
    return (height / 2) + ((worldY - _this.centerY) / scale);
  }

  this.screenToX = screenToX;
  this.screenToY = screenToY;
  this.XToScreen = XToScreen;
  this.YToScreen = YToScreen;

  this.getWidth = function() {
    return width;
  }

  this.getHeight = function() {
    return height;
  }

  var getStarCanvas = function(r) {
    if(!starCache[r]) {
      var s = document.createElement('canvas');
      if(r > 1) {
        s.width = (r*2)+2;
        s.height = (r*2)+2;
      } else {
        s.width = 3;
        s.height = 3;
      }

      var c = s.getContext('2d');
      if(r > 1) {
        c.beginPath();
        c.arc(r + 1, r + 1, r, 0, 2*Math.PI);
        c.closePath();
        c.fillStyle = '#FFFF66';
        c.fill();
      } else {
        c.fillStyle = 'rgb(' + Math.floor(255 * r) + ',' +
                               Math.floor(255 * r) + ',' +
                               Math.floor(96 * r) + ')';
        c.fillRect(1, 1, 1, 1);
      }

      starCache[r] = s;
    }

    return starCache[r];
  }

  this.getStarCache = function() {
    return starCache;
  }

  var drawStar = function(star) {
    var r = star.r / scale;
    var sc = 10;
    if(r <= 1) {
      sc = 255;
    }

    r = Math.floor(r * sc) / sc;

    var c = getStarCanvas(r);

    ctx.drawImage(c, XToScreen(star.x) - r, YToScreen(star.y) - r);
  }
  
  this.drawStars = function(stars) {
    for(var i = 0; i < stars.length; i++) {
      drawStar(stars[i])
    }
  }

  this.drawOverlay = function(selected) {
    // Draw Selection Boxes
    ctx.strokeStyle = '#00CC00';
    ctx.lineWidth = 1;
    for(var i in selected) {
      var s = selected[i];
      var x = XToScreen(s.x);
      var y = YToScreen(s.y);

      ctx.strokeRect(x - 10, y - 10, 20, 20);
      ctx.closePath();
    }
  }

  this.updateCursor = function(x, y) {
    _this.lastX = x;
    _this.lastY = y;
    debug.rLastX = x;
    debug.rLastY = y;
  }

  this.zoom = function(factor) {
    var x = screenToX(_this.lastX);
    var y = screenToY(_this.lastY);
    var dx = (x - _this.centerX) / scale;
    var dy = (y - _this.centerY) / scale;
    setScaleBase(scaleBase + (factor));
    _this.setCenter(x - (dx * scale),
                    y - (dy * scale));
  }

  this.pan = function(dx, dy) {
    _this.setCenter(_this.centerX - dx * scale,
                    _this.centerY - dy * scale);
  }

  this.setCenter = function(x, y) {
    _this.centerX = x;
    _this.centerY = y;
    debug.rCenterX = x;
    debug.rCenterY = y;
  }

  this.blank();
  _this.setCenter(0,0);
}
