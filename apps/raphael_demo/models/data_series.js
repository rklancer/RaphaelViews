// ==========================================================================
// Project:   RaphaelDemo.DataSeries
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals RaphaelDemo */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
RaphaelDemo.DataSeries = SC.Record.extend(
/** @scope RaphaelDemo.DataSeries.prototype */ {
  
  points: SC.Record.toMany('RaphaelDemo.DataPoint', { inverse: 'series' } )

}) ;
