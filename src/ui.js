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

var React = require('react');
var ReactDOM = require('react-dom');
var StarProps = require('component/StarProps');
//var DebugTable = require('component/DebugTable');
var InputDebug = require('component/InputDebug');

module.exports = function(sideid, simulation, renderer, input) {
  this.render = function() {
    var csx = renderer.lastX;
    var csy = renderer.lastY;
    var cwx = renderer.screenToX(csx);
    var cwy = renderer.screenToY(csy);

    ReactDOM.render(
      (<div>
        <StarProps selected={simulation.selected} />
        <InputDebug keyboard={input.kbd}
                    mouse={input.mouse}
                    touch={input.touch} />
      </div>),
      document.getElementById(sideid));
  };
}
