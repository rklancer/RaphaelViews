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
  }
}) ;
