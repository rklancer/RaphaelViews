// ==========================================================================
// Project:   RaphaelDemo.pairsController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
RaphaelDemo.pairsController = SC.ArrayController.create(
/** @scope RaphaelDemo.pairsController.prototype */ {

  firstPair: null,
  
  _contentsDidChange: function () {
    this.set('firstPair', this.get('length') > 0 ? this.objectAt(0) : null);
  }.observes('[]'),
  
  addRandomPair: function () {
    var x = Math.random() * 200;
    var y = Math.random() * 200;
    console.log('adding pair (%d, %d)', x, y);
    RaphaelDemo.store.createRecord(RaphaelDemo.Pair, {x: x, y: y, guid: RaphaelDemo.Pair.nextGuid++});
  },
  
  addManyPairs: function (n) {
    var controller = this;
    
    var addPairWithTimeout = function () {
      if (n > 0) {
        n--;
        SC.RunLoop.begin();
        controller.addRandomPair();
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
