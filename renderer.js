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

GRAVITY.renderer = function(bgColor) {
  var width, height, scheduleBlank = false;
  
  var resizeSelf = function() {
    width  = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
  }
  resizeSelf();
    
  var renderer = PIXI.autoDetectRenderer(width, height,
                                        {backgroundColor: bgColor});
  this.view = renderer.view;
  
  var stage = new PIXI.Container();
  
  var gsim = new PIXI.Graphics();
  //var ginput = new PIXI.Graphics();
  
  stage.addChild(gsim);
  //stage.addChild(ginput);
  
  // Handle window resize gracefully
  window.addEventListener("resize", function() {
    resizeSelf();
    renderer.resize(width, height);
    scheduleBlank = true;
  });
  
  var drawStars = function(g, stars, colorized) {
    var i;
    
    for(i = 0; i < stars.length; i++) {
      if(colorized) {
        gsim.beginFill(0xFFFF66);  // TODO: Color based on mass
      } else {
        gsim.beginFill(bgColor);
      }
      
      gsim.drawCircle(stars[i].x + (width/2), stars[i].y + (height/2), stars[i].r);
      
      gsim.endFill();
    }
  }
  
  this.removeOldStars = function(stars) {
    if(scheduleBlank) {
      // Sometimes (resize event) we have to blank the whole drawing.
      gsim.beginFill(bgColor);
      gsim.drawRect(0, 0, width, height);
      gsim.endFill();
    } else {
      drawStars(gsim, stars, false);
    }
  }
  
  this.showStars = function(stars) {
    drawStars(gsim, stars, true);
  }
  
  this.commitFrame = function() {
    renderer.render(stage);
  }
}