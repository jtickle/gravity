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

class InputDebug extends React.Component {
  render() {
    var k = this.props.keyboard;
    var m = this.props.mouse;
    var t = this.props.touch;

    var avg = null;
    if(t.average) { avg = (
      <tbody>
        <tr>
          <td>avgX</td>
          <td>{t.average.x}</td>
        </tr>
        <tr>
          <td>avgY</td>
          <td>{t.average.y}</td>
        </tr>
      </tbody>);}

    var pb = function(b) { return b ? "ON" : "off"; }

    return (
      <table className="debug">
        <thead>
          <tr>
            <td colSpan="2">Keyboard</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Shift</td>
            <td>{pb(k.shift)}</td>
          </tr>
          <tr>
            <td>Alt</td>
            <td>{pb(k.alt)}</td>
          </tr>
          <tr>
            <td>Ctrl</td>
            <td>{pb(k.ctrl)}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <td colSpan="2">Mouse</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>x</td>
            <td>{m.x}</td>
          </tr>
          <tr>
            <td>y</td>
            <td>{m.y}</td>
          </tr>
          <tr>
            <td>wheel</td>
            <td>{m.w}</td>
          </tr>
          <tr>
            <td>mode</td>
            <td>{m.m}</td>
          </tr>
          <tr>
            <td>left</td>
            <td>{pb(m.l)}</td>
          </tr>
          <tr>
            <td>middle</td>
            <td>{pb(m.m)}</td>
          </tr>
          <tr>
            <td>right</td>
            <td>{pb(m.r)}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <td colSpan="2">Touch</td>
          </tr>
        </thead>
        {avg}
        {Object.keys(t.touches).map(function(v, i) {
          return (
            <tbody id={i}>
              <tr>
                <td>x({v})</td>
                <td>{t.touches[v].x}</td>
              </tr>
              <tr>
                <td>y({v})</td>
                <td>{t.touches[v].y}</td>
              </tr>
            </tbody>
          );})}
      </table>
    );
  }
}

module.exports = InputDebug;
