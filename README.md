JavaScript Gravity Simulation
=============================

JavaScript Gravity is inspired by
[Gravity by Nowy Kurier](http://www.nowykurier.com/toys/gravity/gravity.html).
It's a neat thing and a job well done, but I wanted to expand upon his
work.  According to his site, he's working on a new one, so perhaps we
can have ourselves a little friendly competition!

This simulation will be limited by the O(n^2) nature of perfect gravity
calculations; as the physicist will tell you, every object in the system
must be compared to every other object in the system per-frame.  There
are more intelligent ways to do this for very large systems where
individual objects do not matter as much, but I am simply interested in
the small system that can fit within a browser window for now.

Also I use the word "perfect" lightly.  All of this is an approximation
because I cannot do actual continuous gravity calculations.  I plan to
have a "rewind" feature which will simply make "time" negative and run
the simulation backwards, but you will not be able to get back to your
starting point because this is a most chaotic system.

Very much later on down the road I might consider moving the gravity
calculations to the GPU, once that becomes [a sensible thing to do in
the browser](https://www.khronos.org/webcl/).  Apparently you can kind
of do it with shaders in WebGL, but let's get the basic idea going
first, shall we?

Here are the planned features:

* Simulation Control
  * Forward
  * Pause
  * Reverse
  * Multiple Speeds for each (enter s/s rate?)
* Query
  * Show values for closest star to cursor
  * Click to lock to a star, click again to unlock
* Select
  * Elliptical Region (shift for circle)
  * Rectangular Region (shift for square)
  * Delete Selection
  * Set Values In Selection
  * Adjust Values by a constant
* Add Single
  * Mass
  * Position [or mouse click]
  * Momentum [or mouse drag]
* Add Multiple
  * Per-star (no mouse entry): Mass
  * outer angular momentum
  * inner angular momentum
  * star density
  * radius
  * center position [or mouse click]
  * momentum over all stars [or mouse drag
  
Known Issues
------------
Collision just ain't right.  Too late at night to debug the math.

  
Adding a Star
-------------
The Plan above requires making some GUI features for this thing.  In
the mean time, to add a star to the simulation, you can hit F12 and use
the debugging API:

GRAVITY.addStar(X, Y, dX, dY, mass)

Where X and Y are positions, dX and dY are initial momentum, and mass
is just that.
  
Copying
-------

Gravity is licensed under the GNU GPLv3.  See the COPYING file for more
information.

Gravity uses Pixi.js which is Copyright (C) 2013-2015 Mathew Groves
and is licsensed under the MIT License.  This version of Gravity
retrieves Pixi.js in unminified form from cdnjs.com and the library
is not included in this code repository.