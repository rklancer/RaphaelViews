// ==========================================================================
// Project:   RaphaelViews.RaphaelCollectionView
// Copyright: ©2010 Richard Klancer and Concord Consortium
// ==========================================================================
/*globals RaphaelViews */

/** @class

    Base class for creating Raphael-based CollectionViews

    Needs to be the child view of a RaphaelView or a RaphaelCanvasView.

  @extends SC.View 
  @extends RaphaelViews.RenderSupport
*/
RaphaelViews.RaphaelCollectionView = SC.CollectionView.extend(RaphaelViews.RenderSupport, 
/** @scope RaphaelViews.RaphaelView.prototype */ {

  renderCallback: function (raphaelCanvas) {
    return raphaelCanvas.rect(0, 0, 0, 0);      // TODO context should provide a groupElem() method
  },
  
  render: function (context, firstTime) {
    if (firstTime) {
      context.callback(this, this.renderCallback);
      this.renderChildViews(context, firstTime) ;
    }
  },
  
  reloadIfNeeded: function () {
    console.log('RaphaelCollectionView reloadIfNeeded()');
    console.log('content.length: ', this.getPath('content.length'));
    sc_super();
  },
  
  replaceChild: function () {
    console.log('replaceChild');
    sc_super();
  }
});
