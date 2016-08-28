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

class StarProps extends React.Component {
  render() {
    var sel = this.props.selected;
    if (sel.length == 0) {
      return (
        <div id="star-props"><p>No star selected.</p></div>
      );
    } else {
      return (
        <table id="star-props">
          <thead>
            <tr>
              <td>id</td>
              <td>x</td>
              <td>y</td>
              <td>dx</td>
              <td>dy</td>
              <td>m</td>
              <td>r</td>
            </tr>
          </thead>
          <tbody>
            {sel.map(function(star, i) {
              return (
                <tr key={star.id}>
                  <td>{star.id}</td>
                  <td>{star.x}</td>
                  <td>{star.y}</td>
                  <td>{star.dx}</td>
                  <td>{star.dy}</td>
                  <td>{star.m}</td>
                  <td>{star.r}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  }
}

module.exports = StarProps;
