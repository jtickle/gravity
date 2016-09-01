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

Here are the implemented features:

* Gravity Simulation
  * Stars have mass, position, momentum
    * Stars get a radius, calculated on mass change, for drawing the
      pretty circle on the screen
  * Gravity between stars is applied continuously
  * Stars collide and merge in an inelastic collision
* GUI
  * HTML DOM
    * React components for efficiently displaying continuously-updating
      data from the system
  * Overlay
    * Active command cursor/touch hints
    * Marking selected objects
  * Simulation Canvas
    * Display all stars in the system with sizes logarithmic to mass
    * Move the screen around the simulation by holding rightmouse and
      dragging, shift+dragging, or touch-hold-dragging.
      Zoom in and out by scrolling the mouse wheel, or two-finger
      touch dragging.
  * Statistics / Benchmarking
    * Frames Per Second Display
    * Average per-frame processing times for the various computations
      * dT-G - Gravity Calculation
      * dT-S - Drawing Stars
      * dT-O - Drawing Overlay
      * dT-U - DOM UI Update (React updates every frame)
      * dT-T - Total time spent computing the frame
* Query
  * Maintain 'Selected Stars' list within Simulation
  * Display list of 'Selected Stars' attributes in the Sidebar
  * Star closest to mouse cursor is always highlighted with line
    * Green line - click to add to Selected Stars list
    * Red line - click to remove from Selected Stars list

Here are the planned features:

* GUI
  * Simulation Canvas
    * Zoom in and out
* Query
  * Better interface for mobile devices
  * Select Elliptical Region (shift for circle)
  * Select Rectangular Region (shift for square)
  * Delete Selection
  * Set Values In Selection
  * Apply Functions to Sets of Values
    * Impart momentum into the whole system or a selection
    * Adjust all masses by a scalar, observe effect
    * Whatever can be dreamed up here
* Simulation Control
  * Forward
  * Pause
  * Reverse
  * Multiple Speeds for each (enter s/s rate?)
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
  * momentum over all stars [or mouse drag]

  
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

Gravity is licensed under the GNU GPL-3.0.  See the COPYING file for
more information.
