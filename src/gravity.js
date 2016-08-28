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

var Renderer = require('renderer');
var Simulation = require('simulation');
//var actionQueueFac = require('actionQueue.js').fac;
var UI = require('ui');

var SelectOne = require('mode/SelectOne');

var run = function() {
  var renderer = new Renderer(0x000000, 'gravity');
  var simulation = new Simulation(1);
  var ui = new UI('side', simulation);
//  var input = new Input(simulation);
  var mode = new SelectOne(simulation, renderer);
  var pt = 0;

  window.GRAVITY = {};
  
  GRAVITY.addStar = function(x, y, dx, dy, m) {
    simulation.addStar(x, y, dx, dy, m);
  }

  //var actionQueue = new GRAVITY.actionQueue(simulation);

  //var ui = new GRAVITY.ui('side');

  /*var ui = new GRAVITY.ui('mainmenu', 'submenu', 'side', [
    {
      id: "select",
      label: "Select",
      description: "Stellar selection tools",
      onActivate: actionQueue.listener('selectActivated'),
      onDeactivate: actionQueue.listener('selectDeactivated'),
      sub: [
        {
          id: "nearest",
          label: "Nearest",
          description: "Select the star nearest to the cursor",
          onActivate: actionQueue.listener('selectNearestActivated'),
          onDeactivate: actionQueue.listener('selectNearestDeactivated')
        }
      ]
    },
    {
      id: "insert",
      label: "Insert",
      description: "Add stars",
      onActivate: actionQueue.listener('insertActivated'),
      onDeactivate: actionQueue.listener('insertDeactivated'),
      sub: [
        {
          id: "one",
          label: "One",
          description: "Click to insert a star and drag to give it momentum, release to create",
          onActivate: actionQueue.listener('insertOneActivated'),
          onDeactivate: actionQueue.listener('insertOneDeactivated')
        }
      ]
    }
  ]);*/

  //var tools = new GRAVITY.tools(simulation, renderer, ui);
  
  function animate(ct) {
    var dt, collisions;
    
    // Delta-Time in Seconds since Last Frame
    var dt = (ct - pt) / 1000;
    
    // Request to call myself at next frame
    requestAnimationFrame(animate);
    
    // Don't do any actual simulation unless time has moved.  Saves us
    // some later division by zero problems, and is only a problem in
    // the first couple of frames.
    if (dt <= 0) return;
    
    // Black-out the old stars; NOTE: we are not clearing the whole
    // frame here because we would like to keep star-trails around,
    // which cannot be re-calculated due to the chaotic nature of this
    // simulation.
    //renderer.removeOldStars(simulation.stars);
    renderer.blank();
    
    // Apply Gravity (note: this will remove stars that have collided)
    simulation.applyGravity(dt);
    
    // Draw stars in new positions
    renderer.addNewStars(simulation.stars);

    // Draw Overlay - non-HTMl UI elements
    renderer.drawOverlay(simulation.selected);

    mode.activate();
    mode.mutate();
    mode.render();
    ui.render();

    // Deal with UI - process action queue
    //actionQueue.flushQueue(tools);

    // Deal with UI - render tool
    //tools.render(renderer);
    
    // Advance Previous Time
    pt = ct;
  }
  
  animate(0);
}

document.addEventListener('DOMContentLoaded', function() {
  
  run();

  // Generate a bunch of random stars
  for(var i = 0; i < 500; i++) {
    var radius = Math.random() * 750;
    var theta  = Math.random() * 2 * Math.PI;
    var magnit = radius / 10;
    var direc  = theta - 90;

    console.log(Math.log(radius));

    window.GRAVITY.addStar(radius * Math.cos(theta),
                    radius * Math.sin(theta),
                    magnit * Math.cos(direc),
                    magnit * Math.sin(direc),
                    Math.random() * 90 + 10);
  }

  /*
  GRAVITY.addStar(   0, 0, 10,   0, 1000);
  GRAVITY.addStar(  50, 0,  0,  25, 1000);
  GRAVITY.addStar( -50, 0,  0, -25, 1000);
  GRAVITY.addStar( 100, 0,  0,  50, 1000);
  GRAVITY.addStar(-100, 0,  0, -50, 1000);
  GRAVITY.addStar(  10,20, 10,  65, 100);*/

  /* Features:
     + Simulation Control
       + Forward
       + Pause
       + Reverse
       + Multiple Speeds for each (enter s/s rate?)
     + Query
       + Show values for closest star to cursor
       + Click to lock to a star, click again to unlock
     + Select Elliptical Region (shift for circle)
     + Select Rectangular Region (shift for square)
     + Add Single
       + Mass
       + Position [or mouse click]
       + Momentum [or mouse drag]
     + Add Multiple (like add Galaxy)
       + Per-star (no mouse entry): Mass
       + Overall:
         + outer angular momentum
         + inner angular momentum
         + star density
         + radius
         + center position [or mouse click]
         + momentum over all stars [or mouse drag] */

  /* Star Object:
     { x:  X-axis position in graphic
       y:  Y-axis position in graphic
       dx: Change in X per second
       dy: Change in Y per second
       m:  Mass
       r:  Radius } */
});
