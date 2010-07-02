// ==========================================================================
// Project:   RaphaelViews.RaphaelView
// Copyright: ©2010 Richard Klancer and Concord Consortium
// ==========================================================================
/*globals RaphaelViews */

/** @class

    Base class for creating Raphael-based views with actual content.

    Needs to be the child view of another RaphaelView or a RaphaelCanvasView.

    Override the render() method as needed to render the content of your view.

  @extends SC.View
  @extends RaphaelViews.RenderSupport
*/
RaphaelViews.RaphaelView = SC.View.extend(RaphaelViews.RenderSupport, 
/** @scope RaphaelViews.RaphaelView.prototype */ {
});
