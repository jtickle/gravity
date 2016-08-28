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

class ViewportStats extends React.Component {
  render() {
    var p = this.props;
    return (
      <table>
        <thead>
          <tr>
            <td colSpan="2">Viewport</td>
            <td colSpan="2">Cursor</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>X</td>
            <td>{p.vx}</td>
            <td>WX</td>
            <td>{p.cwx}</td>
          </tr>
          <tr>
            <td>Y</td>
            <td>{p.vy}</td>
            <td>WY</td>
            <td>{p.cwy}</td>
          </tr>
          <tr>
            <td>B</td>
            <td>{p.vb}</td>
            <td>SX</td>
            <td>{p.csx}</td>
          </tr>
          <tr>
            <td>S</td>
            <td>{p.vs}</td>
            <td>SY</td>
            <td>{p.csy}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

module.exports = ViewportStats;
