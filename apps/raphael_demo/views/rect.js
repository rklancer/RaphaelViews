// ==========================================================================
// Project:   RaphaelDemo.RectView
// Copyright: ©2010 Richard Klancer
// ==========================================================================
/*globals RaphaelDemo RaphaelViews */

/** @class

  (Document Your View Here)

  @extends RaphaelViews.RaphaelView
*/
RaphaelDemo.RectView = RaphaelViews.RaphaelView.extend(
/** @scope RaphaelDemo.RectView.prototype */ {

  displayProperties: 'x y width height fill stroke'.w(),
  
  renderCallback: function (raphaelCanvas, x, y, width, height, fill, stroke) {
    return raphaelCanvas.rect(x, y, width, height).attr({ fill: fill, stroke: stroke });
  },
  
  render: function (context, firstTime) {
    // note context should always be a RaphaelContext
    
    if (firstTime) {
      context.callback(this, this.renderCallback, this.get('x'), this.get('y'), this.get('width'), 
        this.get('height'), this.get('fill'), this.get('stroke'));
      this.renderChildViews(context, firstTime);      // don't forget to render child views
    }
    else {
      var rect = context.raphael();
      rect.attr({ x: this.get('x'), y: this.get('y'), width: this.get('width'), height: this.get('height'), 
        fill: this.get('fill'), stroke: this.get('stroke') });
    }
  }

});
