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
    childViews: 'fastPathView noFastPathView'.w(), 
    
    fastPathView: SC.View.design({
      layout: { centerX: 0, centerY: -140, left: 0, right: 0, height: 280 },
      
      childViews: 'labelView drawingView addPairButton timingView'.w(),
      
      labelView: SC.LabelView.design({
        layout: { centerX: 0, top: 20, left: 20, right: 20, height: 42 },
        classNames: 'view-label'.w(),
        value: "Using fast RaphaelCollectionView (the new way):"
      }),

      drawingView: RaphaelViews.RaphaelCanvasView.design({
        layout: { centerX: -100, centerY: 40, width: 320, height: 200 },

        childViews: 'rectView'.w(),

        rectView: RaphaelDemo.RectView.design({
          x: 0,
          y: 0,
          width: 320,
          height: 200,
          fill: '#aa0000',
          stroke: '#aa0000',

          childViews: 'fastPathScatterView '.w(),

          fastPathScatterView: RaphaelViews.RaphaelCollectionView.design({
            exampleView: RaphaelDemo.DataPointView,
            contentBinding: 'RaphaelDemo.fastPathController',
            useFastPath: YES
          })
        })
      }),

      addPairButton: SC.ButtonView.design({
        layout: { centerX: 175, centerY: 15, width: 150, height: 28 },
        title: "Add 20 Points",
        target: RaphaelDemo.fastPathController,
        action: 'add20Points'
      }),

      timingView: SC.LabelView.design({
        layout: { centerX: 250, centerY: 65, width: 300, height: 28 },
        totalTimeBinding: 'RaphaelDemo.fastPathController.totalTime',
        classNames: 'timing-label',

        value: function () {
          return Math.round(this.get('totalTime') / 20) + ' ms per point';
        }.property('totalTime').cacheable()
      })
    }),
    
    // TODO remove duplicate code below; using the composite view pattern here requires overriding createChildViews
    // rather than just passing hashes (b/c binding paths and useFastPath have to be known at view init time)
    
    noFastPathView: SC.View.design({
      layout: { centerX: 0, centerY: 140, left: 0, right: 0, height: 280 },
      
      childViews: 'labelView drawingView addPairButton timingView'.w(),
      
      labelView: SC.LabelView.design({
        layout: { centerX: 0, top: 20, left: 20, right: 20, height: 42 },
        classNames: 'view-label'.w(),
        value: "Complete redraw after every new point (the old way):"
      }),

      drawingView: RaphaelViews.RaphaelCanvasView.design({
        layout: { centerX: -100, centerY: 40, width: 320, height: 200 },

        childViews: 'rectView'.w(),

        rectView: RaphaelDemo.RectView.design({
          x: 0,
          y: 0,
          width: 320,
          height: 200,
          fill: '#aa0000',
          stroke: '#aa0000',

          childViews: 'noFastPathScatterView '.w(),

          noFastPathScatterView: RaphaelViews.RaphaelCollectionView.design({
            exampleView: RaphaelDemo.DataPointView,
            contentBinding: 'RaphaelDemo.noFastPathController',
            useFastPath: NO            
          })
        })
      }),

      addPairButton: SC.ButtonView.design({
        layout: { centerX: 175, centerY: 15, width: 150, height: 28 },
        title: "Add 20 Points",
        target: RaphaelDemo.noFastPathController,
        action: 'add20Points'
      }),

      timingView: SC.LabelView.design({
        layout: { centerX: 250, centerY: 65, width: 300, height: 28 },
        totalTimeBinding: 'RaphaelDemo.noFastPathController.totalTime',
        classNames: 'timing-label',

        value: function () {
          return Math.round(this.get('totalTime') / 20) + ' ms per point';
        }.property('totalTime').cacheable()
      })
    })
    
  })
});
