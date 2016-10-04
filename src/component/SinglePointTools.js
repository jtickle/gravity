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
var SelectOneOptions = require('component/SelectOneOptions');
var InsertOneOptions = require('component/InsertOneOptions');

class SinglePointTools extends React.Component {
  render() {
    var _this = this;

    switch(this.props.active) {
      case 'SelectOne':
      var ActiveToolOptions = SelectOneOptions;
      break;
      case 'InsertOne':
      var ActiveToolOptions = InsertOneOptions;
      break;
    }

    var selectSelectOne = function() {
      _this.props.onChangeActive('SelectOne');
    }

    var selectInsertOne = function() {
      _this.props.onChangeActive('InsertOne');
    }

    console.log(this.props);

    return (
      <div className="tools">
        <div className="tools-selector">
          <ul>
            <li><button className={this.props.active == 'SelectOne' ? 'active' : ''}
                        onClick={selectSelectOne}>Select</button></li>
            <li><button className={this.props.active == 'InsertOne' ? 'active' : ''}
                        onClick={selectInsertOne}>Insert</button></li>
          </ul>
        </div>
        <ActiveToolOptions options={this.props.options} onChange={this.props.onChangeOptions} />
      </div>);
  }
}

module.exports = SinglePointTools;
