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
if (!GRAVITY.uic) { GRAVITY.uic = {}; }

GRAVITY.uic.menu = function(main, sub, id, actions) {
  var isMain = !!sub;

  var activeElement = null;
  var activeAction = null;
  var activeSub = null;

  var listener = function(action) {
    return function(e) {
      if(e.target == activeElement)
        return;

      if(activeAction) {
        activeAction.onDeactivate();
        activeElement.classList.remove('active');
      }

      activeElement = e.target;
      activeElement.classList.add('active');

      activeAction = action;

      if(isMain) {
        if(activeSub) activeSub.deactivate();
        activeSub = new GRAVITY.uic.menu(sub, null, id + '-' + action.id, action.sub);
      }
    }
  }

  this.deactivate = function() {
    if(activeAction) activeAction.onDeactivate();
    activeAction = null;
    activeElement = null;
    activeSub = null;
  }

  this.activate = function() {
    main.children[0].children[0].children[0].click();
  }

  var clearMenu = function(menu) {
    while(menu.firstChild) {
      menu.removeChild(menu.firstChild);
    }
  }

  var buildMenu = function(menu, id, actions) {
    clearMenu(menu);
    var ul = document.createElement('ul');
    for(var i = 0; i < actions.length; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.setAttribute("id", id + actions[i].id);
      a.setAttribute("href", "#");
      a.addEventListener("click", listener(actions[i]));
      var text = document.createTextNode(actions[i].label);
      a.appendChild(text);
      li.appendChild(a);
      ul.appendChild(li);
    }
    menu.appendChild(ul);
  }

  buildMenu(main, id, actions);
  this.activate();
}


GRAVITY.ui = function(mainid, subid, actions) {
  var main = new GRAVITY.uic.menu(document.getElementById(mainid),
                                  document.getElementById(subid),
                                  'ctl-',
                                  actions);
}
