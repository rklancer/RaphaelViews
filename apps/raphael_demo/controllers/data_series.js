// ==========================================================================
// Project:   RaphaelDemo.dataSeriesController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
RaphaelDemo.DataSeriesController = SC.ArrayController.extend(
/** @scope RaphaelDemo.dataSeriesController.prototype */ {

  query: function () {
    var series = this.get('series');
    return SC.Query.local(RaphaelDemo.DataPoint, { 
      conditions: 'series = {series}',
      series: series,
      orderBy: 'id'
    });
  }.property('series').cacheable(),
    
  content: function () {
    var query = this.get('query');
    return RaphaelDemo.store.find(query);
  }.property('query').cacheable(),
  
  addRandomPair: function () {
    var x = Math.random() * 200;
    var y = Math.random() * 200;
    console.log('adding pair (%d, %d)', x, y);
    var point = RaphaelDemo.store.createRecord(RaphaelDemo.DataPoint, {
      x: x, 
      y: y, 
      guid: RaphaelDemo.DataPoint.nextGuid++
    });
    
    point.set('series', this.get('series'));
  },
  
  addManyPairs: function (n) {
    var controller = this;
    
    var addPairWithTimeout = function () {
      if (n > 0) {
        n--;
        SC.RunLoop.begin();
        controller.addRandomPair();
        // RaphaelDemo.store.commitRecords();            // make the changes stick
        SC.RunLoop.end();
        setTimeout(addPairWithTimeout, 1);
      }
      else {
        controller.timingStop();
        SC.RunLoop.begin();
        SC.RunLoop.end();
      }
    };

    SC.RunLoop.end();

    this.timingStart();
    addPairWithTimeout();
  },
  
  startTime: null,
  endTime: null,
  
  timingStart: function () {
    this.set('startTime', new Date());
  },
  
  timingStop: function () {
    this.set('endTime', new Date());
  },
  
  totalTime: function () {
    return this.get('endTime') - this.get('startTime');
  }.property('endTime').cacheable(),
  
  add100Pairs: function () {
    this.addManyPairs(100);
  },
  
  add20Pairs: function () {
    this.addManyPairs(20);
  }

}) ;
