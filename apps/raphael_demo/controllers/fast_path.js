// ==========================================================================
// Project:   RaphaelDemo.fastPathController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document Your Controller Here)

  @extends RaphaelDemo.DataSeriesController
*/
sc_require('controllers/data_series');

RaphaelDemo.fastPathController = RaphaelDemo.DataSeriesController.create(
/** @scope RaphaelDemo.fastPathController.prototype */ {
  
  willAddManyPoints: function (n) {
    RaphaelDemo.noFastPathController.disconnect();
  },
  
  didAddManyPoints: function () {
    RaphaelDemo.noFastPathController.reconnect();
  }
  
}) ;
