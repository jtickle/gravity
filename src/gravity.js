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
//var NormalMode = require('mode/normal');
var Input = require('input');

var run = function() {
  // The Simulation
  var simulation = new Simulation(1);

  // The Renderer
  var renderer = new Renderer(0x000000, 'gravity', simulation.debug);

  // The Input Handler
  var input = new Input();
  input.activate(renderer.view);

  // The UI
  var ui = new UI('side', simulation, renderer, input);

  // Previous frame time, updated per-frame by animate function
  var pt = 0;

  // Put simulation in Normal Mode
  //simulation.setMode(new NormalMode(simulation, renderer));

  // Create Public API
  window.GRAVITY = {};

  var stats = {
    cursec: 0,
    count: 0,
    dt: {
      f: 0,
      g: 0,
      s: 0,
      o: 0,
      u: 0,
      t: 0
    }
  }

  var timers = [];

  var time = {
    begin: function() {
      timers.push(Date.now());
    },
    end: function() {
      var now = Date.now();
      var then = timers.pop();
      return (now - then) / 1000;
    }
  };

  var floor5 = function(n) {
    return Math.floor(n * 1000) / 1000;
  }

  var justshowstat = function(id, n) {
    document.getElementById(id).textContent = n;
  }

  var showstat = function(id, n, count) {
    justshowstat(id, floor5(n / count));
  }

  // Adds a star to the simulation
  GRAVITY.addStar = function(x, y, dx, dy, m) {
    simulation.addStar(x, y, dx, dy, m);
  }

  function animate(ct) {
    var dt, collisions;
    
    // Delta-Time in Seconds since Last Frame
    var dt = (ct - pt) / 1000;

    time.begin();
    stats.dt.f += floor5(dt);
    
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
    time.begin();
    simulation.applyGravity(dt);
    stats.dt.g += time.end();

    // Let the Input Mode have a chance to change the state of the system
    //simulation.mode.mutate();
    
    // Draw stars in new positions
    time.begin();
    renderer.addNewStars(simulation.stars);
    stats.dt.s += time.end();

    // Draw Overlay - non-HTMl UI elements
    time.begin();
    renderer.drawOverlay(simulation.selected);
    stats.dt.o += time.end();

    // Let the Input Mode draw on top of all that
    //simulation.mode.render();

    // Update the React HTML UI
    time.begin();
    ui.render();
    stats.dt.u += time.end();

    // Calculate FPS
    stats.count++;
    var sec = Math.floor(ct/1000);
    if(sec != stats.cursec) {
      // Display Stats once a second
      justshowstat('stats-fps', stats.count);
      showstat('stats-dt-f', stats.dt.f, stats.count);
      showstat('stats-dt-g', stats.dt.g, stats.count);
      showstat('stats-dt-s', stats.dt.s, stats.count);
      showstat('stats-dt-o', stats.dt.o, stats.count);
      showstat('stats-dt-u', stats.dt.u, stats.count);
      showstat('stats-dt-t', stats.dt.t, stats.count);
      stats.cursec = sec;
      stats.count = 0;
      stats.dt.f = 0;
      stats.dt.g = 0;
      stats.dt.s = 0;
      stats.dt.o = 0;
      stats.dt.u = 0;
      stats.dt.t = 0;
    }
    // Advance Previous Time
    pt = ct;

    stats.dt.t += time.end();
    timers.length = 0;
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

    window.GRAVITY.addStar(radius * Math.cos(theta),
                    radius * Math.sin(theta),
                    magnit * Math.cos(direc),
                    magnit * Math.sin(direc),
                    Math.random() * 90 + 10);
  }
});
