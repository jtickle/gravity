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

var Star = require('sim/star');

var starid = 0;

module.exports = function(G0) {
  this.G = G0;

  var _this = this;

  var calcGravityAndCollide = function(G, S1, S2) {
    var xd, yd, r2, r,
        f,  th, fx, fy;
        
    // Discrete Gravity Approximation.
    // NOTE: We are ignoring the time of the frame and simply assuming that it is
    // a relatively constant scaling factor corrected for in the G constant.  This
    // does add error to the approximation.
    
    xd = S2.x - S1.x;        // X Component of distance
    yd = S2.y - S1.y;        // Y Component of distance
    r2 = xd*xd + yd*yd;      // Distance squared between stars
    f  = G / r2;             // Force due to gravity
    th = Math.atan2(xd, yd); // Angle between line through stars and X-axis
    fx = f * Math.sin(th);   // X Component of Force
    fy = f * Math.cos(th);   // Y Component of Force
    
    // Apply force components to star momentum components
    // At this point, we multiply in the mass of the other star to get
    // a true value of acceleration
    S1.dx += (fx * S2.m);
    S1.dy += (fy * S2.m);
    S2.dx -= (fx * S1.m);
    S2.dy -= (fy * S1.m);
    
    // Collision detection works by testing whether the distance
    // between star centers is less than the sum of their radii. This
    // works most of the time, but can occasionally result in failed
    // collision detection (and therefore extreme, unrealistic momenta)
    // if masses are high and frames are long.  A better method would
    // be to predict the stellar motions and determine intersection of
    // line segments, but that is just too much wasted calculation for
    // now.  Something to try later:
    // http://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/
    
    r = Math.sqrt(r2);
    return r <= (S1.r + S2.r);
  }
  
  // All of this collision code makes the wild assumption that no more
  // than two stars can be involved in a collision, which is not
  // enforced but good enough for government work.  If a star collides
  // with more than one other star in the frame, this whole thing will
  // crash because of the screwed up array indexes.
  var mergeStars = function(stars, cs) {
    var i, S1, S2, m;
    
    for(i = 0; i < cs.length; i+=2) {
      S1 = stars[cs[i]];
      S2 = stars[cs[i+1]];
      //console.log("Merged", S1, S2);
      m = S1.m + S2.m;
      S1.dx = ((S1.dx * S1.m) + (S2.dx * S2.m)) / m;
      S1.dy = ((S1.dy * S1.m) + (S2.dy * S2.m)) / m;
      S1.setMass(m);

      if(_this.unselect(S2)) {
        _this.select(S1);
      }
      
      stars.splice(cs[i+1], 1);
    }
  }
    
  this.applyGravity = function(dt) {
    var i, j, S1, S2, collisions, inCollision;
    
    collisions = [];
    
    for (i = 0; i < this.stars.length; i++) {
      S1 = this.stars[i];
      inCollision = false;
      
      for (j = i+1; j < this.stars.length; j++) {
        S2 = this.stars[j];
        
        // Gravity calculation also detects collisions for now
        if(calcGravityAndCollide(this.G, S1, S2)) {
          inCollision = true;
          collisions.push(i);
          collisions.push(j);
        }
      }
      
      if(!inCollision) {
        // Apply Momentum Changes
        S1.x += S1.dx * dt;
        S1.y += S1.dy * dt;
      }
    }
    
    mergeStars(this.stars, collisions);
  }

  this.addStar = function(x, y, dx, dy, m) {
    var s = new Star(x, y, dx, dy, m);
    _this.stars.push(s);
    return s;
  }

  this.select = function(star) {
    if(!_this.isSelected(star)) {
      _this.selected.push(star);
      return true;
    }
    return false;
  }

  this.unselect = function(star) {
    var idx = _this.selected.indexOf(star);
    if(idx == -1) return false;
    _this.selected.splice(idx, 1);
    return true;
  }

  this.isSelected = function(star) {
    return _this.selected.indexOf(star) > -1;
  }

  this.toggleSelected = function(star) {
    if(!this.isSelected(star)) {
      this.select(star);
      return true;
    } else {
      this.unselect(star);
      return false;
    }
  }

  this.setMode = function(mode) {
    console.log(mode);
    if(_this.mode) {
      _this.mode.deactivate();
    }

    if(mode) {
      _this.mode = mode;
      _this.mode.activate();
    } else {
      _this.mode = null;
    }
  }

  this.stars = [];
  this.selected = [];
  this.mode = null;

  this.debug = {};
  
}
