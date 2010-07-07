// ==========================================================================
// Project:   RaphaelViews.RaphaelRenderSupport
// Copyright: ©2010 Richard Klancer and Concord Consortium
// ==========================================================================
/*globals RaphaelViews */

/** @namespace
  
    Modifies and extends SC.View functionality for SC.View subclasses that want to render using a RaphaelContext
  
*/
RaphaelViews.RenderSupport = {

  // default behavior that we can override
  render: function (context, firstTime) {
    if (firstTime) this.renderChildViews(context, firstTime);
  },
  
  /**
    Handles changes in the layer id. Modified from SC.View for bugfixes needed by CollectionFastPath mixin.
    Heads up on the need for this bugfix to alexiskander.
    
    Yes, this really works to monkey patch SC.View.layerIdDidChange (observers added by 
    'function () {...}.observes(...)' are referenced by name, so the observer dispatcher will find this method instead
    of the base layerIdDidChange)
    
  */
  layerIdDidChange: function() {
    var layer = this.get("layer");
    if (layer && this.get("layerId") !== this._lastLayerId) {
      // if we had an earlier one, remove from view hash. If another view has just claimed our old layerId in the 
      // views hash, be careful not to overwrite that view. (bugfix per alexiskander)
      if (this._lastLayerId && SC.View.views[this._lastLayerId] === this) {
        delete SC.View.views[this._lastLayerId];
      }
      
      // set the current one as the new old one
      this._lastLayerId = this.get("layerId");
      
      // and add the new one
      SC.View.views[this.get("layerId")] = this;
      
      // and finally, set the actual layer id.
      layer.id = this.get("layerId");
    }
  }.observes('layerId'),


  createLayer: function () {
    if (this.get('layer')) return;          // move along, nothing to do here

    var raphaelContext = RaphaelViews.RaphaelContext();
    raphaelContext.isTopLevel = NO;

    this.prepareRaphaelContext(raphaelContext, YES);
    this.set('layer', raphaelContext.populateCanvas(this.get('raphaelCanvas')));

    // now notify the view and its child views..
    this._notifyDidCreateLayer();
  },


  // Modified from SC.View's 'layer' getter/setter, which is problematic because it caches the found layer
  // without an apparent mechanism to flush the cached value.
  layer: function(key, value) {
    if (value !== undefined) {
      // setting layer
      this._view_layer = value ;
    }
    else {
      // get layer
      value = this._view_layer;           // use cached value only if explicitly set.
      if (!value) {
        var parent = this.get('parentView');
        if (parent) parent = parent.get('layer');
        if (parent) {
          value = this.findLayerInParentLayer(parent);      // generally findLayerInParentLayer will be fast
        }
        parent = null ; // avoid memory leak
      }
    }
    return value ;
  }.property('isVisibleInWindow'),


  raphaelCanvas: function () {
    var pv = this.get('parentView');
    return pv.get('raphaelCanvas');     // recurse until you hit parent RaphaelCanvasView
  }.property(),


  raphaelObject: function () {
    var layer = this.get('layer');
    return layer && layer.raphael;
  }.property(),


  updateLayer: function () {
    var context = RaphaelViews.RaphaelContext(this.get('layer'));
    this.prepareRaphaelContext(context, NO);
    context.update();
  },


  prepareRaphaelContext: function (raphaelContext, firstTime) {
    raphaelContext.id(this.get('layerId'));
    raphaelContext.visible(this.get('isVisible'));
    
    this.beginPropertyChanges();
    this.set('layerNeedsUpdate', NO);
    this.render(raphaelContext, firstTime);
    this.endPropertyChanges();
  },


  renderChildViews: function (context, firstTime) {
    var cv = this.get('childViews');
    var view;

    for (var i=0, ii=cv.length; i<ii; ++i) {
      view = cv[i];
      if (!view) continue;

      context = context.begin();
      view.prepareRaphaelContext(context, firstTime);
      context = context.end();
    }

    return context;
  },


  // CollectionFastPath support
  
  
  /**
    @private
    Hides the view using Raphael, before it's pooled, because the standard off-screening mechanism used by
    CollectionFastPath won't work for Raphael views. Note that even though this method is called 'sleepInDOMPool',
    CollectionFastPath may eventually move this from the DOM pool to an off-DOM pool before it's awakened.
  */
  sleepInDOMPool: function () {
    this._wasVisibleBeforeSleep = this.get('isVisible');
    var layer = this.get('layer');  
    if (layer && layer.raphael && this._wasVisibleBeforeSleep) {
      layer.raphael.hide();
    }
  },
  
  /**
    @private
    Re-show the view if it's been pooled in the DOM.
  */
  wakeFromDOMPool: function () {
    this.wakeFromPool();
  },
  
  /**
    @private
    Re-show the view if it's been pooled off-DOM. Note that even though the only sleep method is 'sleepInDOMPool()',
    we can't therefore conclude that this view will be awakened from the DOM pool. CollectionFastPath moves some views
    from the DOM pool to the off-DOM pool while they sleep.
  */
  awakeFromPool: function () {
    this.wakeFromPool();
  },
  
  /**
    @private
    Re-show the view whether it's been pooled on or off-DOM.
  */
  wakeFromPool: function () {
    var layer = this.get('layer');
    if (this._wasVisibleBeforeSleep && layer && layer.raphael) layer.raphael.show();
  }
};
