=============================================================================

Project:   RaphaelViews

Copyright: ©2010 Richard Klancer and Concord Consortium

Licensed under the MIT license. See file 'license.js'

=============================================================================

# SproutCore RaphaelViews

This project aims to provide a set of [Sproutcore](http://sproutcore.com)
classes which you can use to create views that render their content as vector
graphics while retaining the following:

* the advantages of [RaphaëlJS](http://www.raphaeljs.com): 
  * cross-browser compatibility for vector graphics
  * a simple and proven drawing API for use by your render() methods

* the standard semantics of Sproutcore views: 
  * your view is represented by an SVG or VML 'layer' node which may contain 
    children
  * your view's render() method can be simple and doesn't need to know about
    the DOM context it's rendering into
  * events are handled by the standard Sproutcore event delegation mechanism 
  * your view can have child views (which must themselves be RaphaelViews) 
    which can be specified by the standard 'childViews' parameter and 
    rendered via the standard renderChildViews() method

I have also extended the Sproutcore CollectionView class with a mixin that
allows RaphaelViews-based exampleViews. This allows an interactive scatter
plot to be implemented as a CollectionView, thereby retaining many of the
advantages of the Sproutcore collection view pattern.

Using the new CollectionViewFastPath mixin provided by Sproutcore, this
enables a scatter plot to continuously update with new streamed data,
*without* re-rendering itself every time a point is added.


## Sproutcore and Raphaël, sitting in a tree...

The fundamental difficulty that this library aims to overcome is the
incompatibility between the operation of the Sproutcore view system and of
Raphaël. The Sproutcore view system expects that all views render themselves
by calling methods on a 'RenderContext' object which, underneath, builds up
an HTML string. Only at a later time, after your application requests to
append a view's containing pane to the main window, is the HTML string
instantiated as DOM nodes (via an innerHTML mechanism).

This is nice and fast but hard-codes the assumption that all views render
HTML. Raphaël is a well-thought out shim layer above the VML and SVG DOM
APIs, but requires a DOM to manipulate. It also provides no mechanism for
grouping nodes together as children of other nodes. (The set() method it
provides allows co-manipulation of sets of objects, but does not group them
in the DOM.) Grouping is required if your view is to have child views and
still do event delegation as per the standard Sproutcore mechanism. (For
example, a RaphaelView can, like a standard Sproutcore view, simply define a
mouseDown() method in order to handle mouse down events on itself or its
children.)

What I have attempted to do here is provide an alternative type of
RenderContext specifically for RaphaelViews. It queues up DOM manipulations
specified by your view's render() method for later execution when your view's
surrounding layer (DOM node) has been created.

When the (regular) view containing your RaphaelCanvas view is instantiated,
the RaphaelContext springs to work, performing the delayed DOM node creation
and manipulation, re-grouping DOM nodes into the appropriate parent-child
inheritance patterns, and associating your view with the DOM nodes created
for it so that event handling works as expected.


## Future Plans

**NOTE** that hacking the DOM produced by Raphaël almost surely means that I
have broken some of the more advanced features of Raphaël. I haven't worked
with this library long enough to know which these are, but don't expect all
Raphaël features to be supported.

This project is in a very early stage at this point. I have not yet
implemented any tests. I also use the now-deprecated render path dating from 
Sproutcore 1.0 and 1.4; I haven't yet digested the Renderer mechanism that is part of Sproutcore 1.5, a.k.a quilmes.

Currently the RaphaelContext simply provides a mechanism by which view's
render() methods provide a callback to be executed when the DOM is ready.
(RaphaelContext calls the callbacks in depth-first order and does some
housekeeping after each callback.)

This is simple, but I expect to provide RaphaelContext methods named
similarly to Raphael's methods, which automatically queue up calls to the
appropriate Raphael methods.

When views are being re-rendered, *i.e.*, called with firstTime = NO, they
need to find their relevant DOM node(s) and then find the Raphael
representation of the nodes (which is cached in the DOM) in order to modify
them. This can be somewhat tricky, especially when a view renders multiple
nodes as part of its own, rather than its child views', content. I expect to
also provide convenience methods for finding and manipulating child nodes
during a re-render.


# Usage


# Installation

NOTE: Requires the 1.5 (quilmes) branch of Sproutcore

You need to copy or clone this project into the frameworks directory of your
project. Assuming your project is a git repository, a best practice is to set up the framework a git submodule, as follows:

1. Make the frameworks directory in the root of your project, if it doesn't
already exist: `mkdir my_project/frameworks`
2. Add RaphaelViews as a git submodule: `cd my_project; git submodule add git://github.com/rklancer/RaphaelViews.git frameworks/raphael_views`
3. When you init the submodules, be sure to use `--recursive`, because RaphaelViews itself includes RaphaelJS as a submodule: `git submodule --init --recursive`

Alternately, you can just checkout RaphaelViews into your frameworks directory, and update its submodules:

1. `cd my_project/frameworks'
2. `git checkout git://github.com/rklancer/RaphaelViews.git raphael_views`
3. `cd raphael_views`
4. `git submodule update --init`
