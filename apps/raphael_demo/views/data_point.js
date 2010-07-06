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

  displayProperties: 'content.x content.y isEnabled isSelected isVisible fill stroke radius'.w(),
  
  fill: '#cccccc',
  stroke: '#cccccc',
  radius: 3,
  isSelected: NO,
  isEnabled: YES,
  selectedFill: '#0000aa',
  selectedStroke: '#0000aa',
  layerIsCacheable: YES,
  isPoolable: YES,
  
  renderCallback: function (raphaelCanvas, x, y, radius, fill, stroke, isVisible) {
    var circle = raphaelCanvas.circle(x, y, radius).attr({ fill: fill, stroke: stroke });
    if (isVisible) circle.show(); else circle.hide();
    return circle;
  },
  
  render: function (context, firstTime) {
    var isSelected = this.get('isSelected');
    var fill = isSelected ?  this.get('selectedFill') : this.get('fill');
    var stroke = isSelected ? this.get('selectedStroke') : this.get('stroke');
    var isVisible = this.get('isVisible');
    
    if (firstTime) {
      context.callback(this, this.renderCallback, this.getPath('content.x') || 0, this.getPath('content.y') || 0, 
        this.get('radius'), fill, stroke, isVisible);
    }
    else {
      var circle = this.get('raphaelObject');
      circle.attr({ cx: this.getPath('content.x') || 0, cy: this.getPath('content.y') || 0, radius: this.get('radius'), 
        fill: fill, stroke: stroke });
      if (isVisible) circle.show(); else circle.hide();
    }
  }

});
