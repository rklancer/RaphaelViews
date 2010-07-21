// ==========================================================================
// Project:   RaphaelViews.RaphaelCanvasView
// Copyright: ©2010 Richard Klancer and Concord Consortium
// ==========================================================================
/*globals RaphaelViews Raphael */

/** @class

    Class for managing the Raphael 'canvas' instance. (Not to be confused with a <canvas> element created by the
    Canvas API. We are not using the Canvas API.)
    
    All Raphael shapes must be drawn within a 'canvas', managed by the object returned by Raphael(). In SVG-supporting
    browsers, this corresponds to the containing <svg> element.
    
    Therefore, all RaphaelView instances must have a RaphaelCanvasView as an ancestor in the view hierarchy.

  @extends SC.View
*/

sc_require('context/raphael_context');

RaphaelViews.RaphaelCanvasView = SC.View.extend(
/** @scope RaphaelViews.RaphaelCanvasView.prototype */ {

  // override the base class notification mechanism, which wants to notify all our descendant views that their layer
  // was created, at the moment our layer is created.
  // That works for normal SC.Views but *our* child view layers aren't created until after we call populateCanvas()
  
  _notifyDidCreateLayer: function() {
    // notify, not just the view, but also the view renderers
    this.notifyPropertyChange('layer');
    this._viewRenderer.attachLayer(this);
    if (this.renderer) this.renderer.attachLayer(this);
    
    this.didCreateLayer() ;
    
    var mixins = this.didCreateLayerMixin;
    if (mixins) {
      for (var i=0, ii=mixins.length; i<ii; ++i) {
        mixins[i].call(this);
      }
    }
  },
  
  
  // notify our children (and, recursively, their children) that their layers have been created.
  _notifyDidCreateChildViewLayers: function () {
    var cv = this.get('childViews');
    for (var i=0, ii=cv.length; i<ii; ++i) {
      if (!cv[i]) continue;
      cv[i]._notifyDidCreateLayer();    // it s/b ok for our children to use the normal SC.View notification mechanism
    }
  },
  
  
  didCreateLayer: function () {
    var layer = this.get('layer');
    var frame = this.get('frame');
    var r = Raphael(layer, frame.width, frame.height);
    this.set('raphaelCanvas', r);
    
    if (this._preparedRaphaelContext) {
      this._preparedRaphaelContext.populateCanvas(r);
      this._notifyDidCreateChildViewLayers();
    }
  },
  
  
  // informs the SC.View that child views' layers should be placed in the contained svg/vml node rather than in this 
  // view's layer node (which is a div)
  containerLayer: function () {
    return this.get('raphaelCanvas').canvas;        // canvas = Raphael's pointer to the SVG or VML element itself
  }.property(),
  
  
  renderChildViews: function (context, firstTime) {
    var cv = this.get('childViews');
    var view;
    
    var raphaelContext = this.raphaelContext();
    raphaelContext.isTopLevel = YES;
    
    for (var i=0, ii=cv.length; i<ii; ++i) {
      view = cv[i];
      if (!view) continue;

      raphaelContext = raphaelContext.begin();
      view.prepareRaphaelContext(raphaelContext, firstTime);
      raphaelContext = raphaelContext.end();
    }  
    this._preparedRaphaelContext = raphaelContext;

    return context;
  },
  
  
  raphaelContext: function () {
    return RaphaelViews.RaphaelContext();
  }
});
