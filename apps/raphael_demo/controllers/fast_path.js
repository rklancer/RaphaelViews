// ==========================================================================
// Project:   RaphaelDemo.fastPathController
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
sc_require('controllers/data_series');

RaphaelDemo.fastPathController = RaphaelDemo.DataSeriesController.create(
/** @scope RaphaelDemo.fastPathController.prototype */ {
  series: null
  
}) ;
