// ==========================================================================
// Project:   RaphaelDemo - mainPage
// Copyright: ©2010 Richard Klancer
// ==========================================================================
/*globals RaphaelDemo RaphaelViews */

// This page describes the main user interface for your application.  
RaphaelDemo.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'drawingView'.w(),
    
    drawingView: RaphaelViews.RaphaelCanvasView.design({
      layout: { centerX: 0, centerY: 0, width: 200, height: 200 },
      
      childViews: 'rectView'.w(),
      
      rectView: RaphaelDemo.RectView.design({
        x: 0,
        y: 0,
        width: 200,
        height: 200,
        fill: '#aa0000',
        stroke: '#aa0000',
        
        childViews: 'pointView'.w(),
        
        pointView: RaphaelDemo.DataPointView.design({
          contentBinding: 'RaphaelDemo.pairsController.firstPair',

          mouseDown: function () {
            alert("Thank you for clicking.");
          }
        })
      })
    })
  })

});
