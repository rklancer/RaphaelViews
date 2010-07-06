// ==========================================================================
// Project:   RaphaelDemo.DataPointView
// Copyright: ©2010 Richard Klancer
// ==========================================================================
/*globals RaphaelDemo RaphaelViews*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/
RaphaelDemo.DataPointView = RaphaelViews.RaphaelView.extend(
/** @scope RaphaelDemo.DataPointView.prototype */ {

  displayProperties: 'content.x content.y isEnabled isSelected fill stroke radius'.w(),
  
  fill: '#cccccc',
  stroke: '#cccccc',
  radius: 3,
  isSelected: NO,
  isEnabled: YES,
  selectedFill: '#0000aa',
  selectedStroke: '#0000aa',
  layerIsCacheable: YES,
  isPoolable: YES,
  
  renderCallback: function (raphaelCanvas, x, y, radius, fill, stroke) {
    return raphaelCanvas.circle(x, y, radius).attr({ fill: fill, stroke: stroke });
  },
  
  render: function (context, firstTime) {
    //addPointWithTimeoutlog('DataPointView render(), firstTime = ', firstTime);
    
    var isSelected = this.get('isSelected');
    var fill = isSelected ?  this.get('selectedFill') : this.get('fill');
    var stroke = isSelected ? this.get('selectedStroke') : this.get('stroke');
    
    if (firstTime) {
      context.callback(this, this.renderCallback, this.getPath('content.x') || 0, this.getPath('content.y') || 0, 
        this.get('radius'), fill, stroke);
    }
    else {
      var circle = this.get('raphaelObject');
      circle.attr({ cx: this.getPath('content.x') || 0, cy: this.getPath('content.y') || 0, radius: this.get('radius'), 
        fill: fill, stroke: stroke });
    }
  },
  
  // CollectionFastPath support TODO: move to RaphaelView or RenderSupport
  
  /**
    @private
    It's necessary to hide the view before it's pooled, because the standard off-screening mechanism used by
    CollectionFastPath won't work for Raphael views. Note that even though this method is called 'sleepInDOMPool',
    CollectionFastPath may eventually move this from the DOM pool to an off-DOM pool before it's awakened.
  */
  // TODO make this save show/hide state before sleeping
  sleepInDOMPool: function () {
    var layer = this.get('layer');
    if (layer && layer.raphael) layer.raphael.hide();
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
    if (layer && layer.raphael) layer.raphael.show();
  }

});
