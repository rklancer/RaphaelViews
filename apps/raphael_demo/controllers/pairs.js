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
  }.observes('[]')
  
}) ;
