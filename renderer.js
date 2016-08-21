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
if (typeof window.GRAVITY == 'undefined') { window.GRAVITY = {}; }

GRAVITY.renderer = function(bgColor, canvasId) {
  var width, height;
    
  var view = document.getElementById(canvasId);
  var ctx = view.getContext('2d');
  
  var resizeSelf = function() {
    width  = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    view.getContext('2d').canvas.width = width;
    view.getContext('2d').canvas.height = height;
  }
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

  var drawStar = function(star, r) {
    if(typeof(r) == 'undefined') r = star.r;
    ctx.beginPath();
    ctx.arc((width/2) + star.x, (height/2) + star.y, r, 0, 2*Math.PI);
    ctx.closePath();
  }
  
  this.removeOldStars = function(stars) {
    for(var i = 0; i < stars.length; i++) {
      drawStar(stars[i], stars[i].r + 1);
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
  }

  this.addNewStars = function(stars) {
    for(var i = 0; i < stars.length; i++) {
      drawStar(stars[i])
      ctx.fillStyle = '#FFFF66';
      ctx.fill();
    }
  }

  this.blank();
}
