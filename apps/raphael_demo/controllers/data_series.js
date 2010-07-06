// ==========================================================================
// Project:   RaphaelDemo.dataSeriesController
// Copyright: ©2010 Richard Klancer
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
RaphaelDemo.DataSeriesController = SC.ArrayController.extend(
/** @scope RaphaelDemo.dataSeriesController.prototype */ {

  series: null,
  contentWhenConnected: null,
  isConnected: YES,
  
  disconnect: function () {
    this.set('isConnected', NO);
  },
  
  reconnect: function () {
    this.set('isConnected', YES);
  },
  
  content: function () {
    if (this.get('isConnected')) {
      return this.get('contentWhenConnected');
    }
    else {
      return [];
    }
  }.property('contentWhenConnected', 'isConnected').cacheable(),
  
  addRandomPoint: function () {
    var x = Math.random() * 320;
    var y = Math.random() * 200;
    var point = RaphaelDemo.store.createRecord(RaphaelDemo.DataPoint, {
      x: x, 
      y: y, 
      guid: RaphaelDemo.DataPoint.nextGuid++
    });
    
    point.set('series', this.get('series'));
  },
  
  addManyPoints: function (n) {
    var controller = this;

    var addPointWithTimeout = function () {
      if (n > 0) {
        n--;
        SC.RunLoop.begin();
        controller.addRandomPoint();
        controller.incrementProperty('nAdded');
        SC.RunLoop.end();
        setTimeout(addPointWithTimeout, 1);
      }
      else {
        controller.timingStop();
        SC.RunLoop.begin();
        controller.didAddManyPoints();
        SC.RunLoop.end();
      }
    };

    this.set('nAdded' , 0);
    this.willAddManyPoints();
    SC.RunLoop.end();

    this.timingStart();
    addPointWithTimeout();
  },
  
  startTime: null,
  endTime: null,
  nAdded: null,
  
  timingStart: function () {
    this.set('startTime', new Date());
  },
  
  timingStop: function () {
    this.set('endTime', new Date());
  },
  
  totalTime: function () {
    return this.get('endTime') - this.get('startTime');
  }.property('endTime').cacheable(),
  
  add100Points: function () {
    this.addManyPoints(100);
  },
  
  add20Points: function () {
    this.addManyPoints(20);
  },
  
  willAddManyPoints: function () {
  },
  
  didAddManyPoints: function () {
  }

}) ;
