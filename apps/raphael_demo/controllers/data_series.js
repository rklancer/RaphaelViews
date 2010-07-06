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
  
  query: function () {
    var series = this.get('series');
    return SC.Query.local(RaphaelDemo.DataPoint, { 
      conditions: 'series = {series}',
      series: series,
      orderBy: 'id'
    });
  }.property('series').cacheable(),
  
  isDisconnected: NO,
  
  disconnect: function () {
    this.set('isDisconnected', YES);
  },
  
  reconnect: function () {
    this.set('isDisconnected', NO);
  },
  
  content: function (key, val) {
    if (this.get('isDisconnected')) {
      return [];
    }
    else {
      var query = this.get('query');
      return RaphaelDemo.store.find(query);
    }
  }.property('query', 'isDisconnected').cacheable(),
  
  addRandomPoint: function () {
    var x = Math.random() * 320;
    var y = Math.random() * 200;
    //console.log('adding pair (%d, %d)', x, y);
    var point = RaphaelDemo.store.createRecord(RaphaelDemo.DataPoint, {
      x: x, 
      y: y, 
      guid: RaphaelDemo.DataPoint.nextGuid++
    });
    
    point.set('series', this.get('series'));
  },
  
  addManyPoints: function (n) {
    var controller = this;
    this.set('nAdded' , 0);
    
    this.willAddManyPoints();
    
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
