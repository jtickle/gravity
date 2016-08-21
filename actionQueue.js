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

GRAVITY.actionQueue = function(simulation) {
  var listeners = {};
  var actionQueue = [];

  this.listener = function(evt) {
    return function() {
      var action = Array.prototype.slice.call(arguments, 0);
      action.unshift(evt);
      actionQueue.push(action);

      console.log(actionQueue);
    }
  }

  this.flushQueue = function(target) {
    while(actionQueue.length > 0) {
      var next = actionQueue.shift();
      var method = next.shift();
      if(typeof(target[method]) == 'undefined') {
        throw "Requested handler is undefined: " + next;
      }

      target[method].apply(next);
    }
  }
}

