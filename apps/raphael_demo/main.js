// ==========================================================================
// Project:   RaphaelDemo
// Copyright: ©2010 Richard Klancer
// ==========================================================================
/*globals RaphaelDemo */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
RaphaelDemo.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  RaphaelDemo.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

  // TODO: Set the content property on your primary controller
  // ex: RaphaelDemo.contactsController.set('content',RaphaelDemo.contacts);
  
  var fastPathSeries = RaphaelDemo.store.find(RaphaelDemo.DataSeries, 'fast-path');
  RaphaelDemo.fastPathController.set('series', fastPathSeries);

  var noFastPathSeries = RaphaelDemo.store.find(RaphaelDemo.DataSeries, 'no-fast-path');
  RaphaelDemo.noFastPathController.set('series', noFastPathSeries);
} ;

function main() { RaphaelDemo.main(); }
