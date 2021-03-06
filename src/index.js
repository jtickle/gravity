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

import Renderer from './Renderer';
import Simulation from './Simulation';
//import UI from 'UI';
import ActionQueue from './ActionQueue';
import Input from './Input';

var run = function() {
  // The Simulation
  var simulation = new Simulation(1);
  var sq = new ActionQueue(simulation);

  // The Renderer
  var renderer = new Renderer(0x000000, 'gravity', simulation.debug);
  var rq = new ActionQueue(renderer);

  // The Input Handler
  var input = new Input(sq, rq);
  input.activate(renderer.view);

  // The UI
  //var ui = new UI('side', simulation, renderer, input);

  // Previous frame time, updated per-frame by animate function
  var pt = 0;

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
  };

  var renderStats = {
    fps:    0,
    dt_f:   0,
    dt_g:   0,
    dt_s:   0,
    dt_o:   0,
    dt_u:   0,
    dt_t:   0
  };

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
    renderStats[id] = n;
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
    
    // Don't do any actual simulation unless time has moved.  Saves us
    // some later division by zero problems, and is only a problem in
    // the first couple of frames.
    if (dt > 0) {
      try {
      
        // Black-out the old stars; NOTE: we are not clearing the whole
        // frame here because we would like to keep star-trails around,
        // which cannot be re-calculated due to the chaotic nature of this
        // simulation.
        renderer.blank();
        
        // Apply Gravity (note: this will remove stars that have collided)
        time.begin();
        simulation.applyGravity(dt);
        stats.dt.g += time.end();

        // Let the Input Mode have a chance to change the state of the system
        rq.process()
        
        // Draw stars in new positions
        time.begin();
        renderer.drawStars(simulation.stars);
        stats.dt.s += time.end();

        // Draw Overlay - non-HTMl UI elements
        time.begin();
        renderer.drawOverlay(simulation.selected);
        stats.dt.o += time.end();

        // Let the Input Mode draw on top of all that

        // Update the React HTML UI
        time.begin();
        //ui.render();
        stats.dt.u += time.end();

        // Calculate FPS
        stats.count++;
        var sec = Math.floor(ct/1000);
        if(sec != stats.cursec) {
          // Display Stats once a second
          justshowstat('fps', stats.count);
          showstat('dt_f', stats.dt.f, stats.count);
          showstat('dt_g', stats.dt.g, stats.count);
          showstat('dt_s', stats.dt.s, stats.count);
          showstat('dt_o', stats.dt.o, stats.count);
          showstat('dt_u', stats.dt.u, stats.count);
          showstat('dt_t', stats.dt.t, stats.count);
          //ui.update();
          console.log(renderer.getStarCache());
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

      } catch(e) {
        console.log('Caught exception, requesting next frame anyway... ', e);
      }
    }

    // Request to call myself at next frame
    requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', function() {
  
  run();

  // Generate a bunch of random stars
  for(var i = 0; i < 300; i++) {
    var radius = Math.random() * 350 + 50;
    var theta  = Math.random() * 2 * Math.PI;
    var magnit = radius / 20;
    var direc  = theta - 90;

    window.GRAVITY.addStar(radius * Math.cos(theta),
                    radius * Math.sin(theta),
                    magnit * Math.cos(direc),
                    magnit * Math.sin(direc),
                    Math.random() * 90 + 10);
  }
});
