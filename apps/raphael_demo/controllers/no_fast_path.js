// ==========================================================================
// Project:   RaphaelDemo.noFastPathController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document Your Controller Here)

  @extends RaphaelDemo.DataSeriesController
*/
sc_require('controllers/data_series');

RaphaelDemo.noFastPathController = RaphaelDemo.DataSeriesController.create(
/** @scope RaphaelDemo.fastPathController.prototype */ {
  
  willAddManyPoints: function (n) {
    RaphaelDemo.fastPathController.disconnect();
  },
  
  didAddManyPoints: function () {
    RaphaelDemo.fastPathController.reconnect();
  }
  
}) ;

