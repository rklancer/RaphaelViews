// ==========================================================================
// Project:   RaphaelViews.RaphaelContext
// Copyright: ©2010 Richard Klancer and Concord Consortium
// ==========================================================================
/*globals RaphaelViews */

/** @namespace

    A RaphaelContext mimics the SC.RenderContext provided by Sproutcore.

    Use it when rendering your RaphaelViews to provide delayed instructions for how to render your view to the Raphael
    canvas.

    The RaphaelContext will take care of executing those instructions at a later time (when the layer surrounding your
    view has been instantiated) and making the DOM nodes so created your view's layer.

    It will also take care of wrapping your layer node in a grouping node together with your child views' layers and
    making the layer node a child of your parent view.

    If you want your view to consist of multiple shapes that are not child views, return a Raphael set object. These
    shapes in the Raphael set will be wrapped in a grouping node so that your view can respond to events within any of
    those shapes.
*/
  
RaphaelViews.RaphaelContext = SC.Builder.create(/** RaphaelViews.RaphaelContext.fn */ {
  
  // remember this isn't really an SC.Object. The semantics of this hash are different than if they were passed to SC.Extend
  // Notably, defining 'children' in the hash would result in all RaphaelContexts sharing the same 'children' array
   
  isRaphaelContext: YES,

  init: function (node, prevContext) {
    this._node = node;
    this.prevObject = prevContext;
    this.isTopLevel = !prevContext;
    this.children = [];
    this._groupNode = NO;

    return this;
  },
  

  begin: function() {
    var ret = RaphaelViews.RaphaelContext(this._node, this);
    this.children.push(ret);
    
    return ret;
  },
  
  
  end: function () {
    return this.prevObject || this;
  },
 
  
  // For now the only way for render method to draw a graph is to pass a callback that calls the raphael methods itself. 
  // Eventually I'll probably add methods to RaphaelContext with the same names as Raphael methods
  // and that allow you to *find* and set attributes on pre-existing Raphael objects 
  // (this would be useful during render when firstTime = NO)
  callback: function (thisArg, callback) {
    this._thisArg = thisArg;
    this._callback = callback;
    this._arguments = Array.prototype.slice.call(arguments, 2);           // store the arguments 2...n
        
    return this;
  },
  
  
  id: function (id) {
    this._id = id;
    return this;
  },
  

  visible: function (isVisible) {
    this._isVisible = isVisible;
    return this;
  },
  
  
  populateCanvas: function (raphaelCanvas) {

    // given a raphael canvas, actually call the callbacks that will create dom nodes using raphael.
    // use our own special sauce here to insert grouping nodes with the appropriate layer ids whenever a view has 
    // child views
    
    var raphaelObjects = [],
        childNode,
        childNodes = [],
        layerNode,
        layerNodes = [],
        raphaelObj,
        groupNode;

    // generate node or set of nodes from the Raphael object returned by the render callback, if any
    if (this._callback) {
      raphaelObj = this._callback.apply(this._thisArg, [raphaelCanvas].concat(this._arguments));
      raphaelObjects = this.flattenRaphaelSets(raphaelObj);
      layerNodes = layerNodes.concat(raphaelObjects.map( this.nodeForRaphaelObject ));
    }
    
    // recursively populateCanvas in child contexts
    for (var i = 0, ii = this.children.length; i < ii; i++) {
      childNode = this.children[i].populateCanvas(raphaelCanvas);
      if (childNode) childNodes.push(childNode);
    }

    // generate a group node at least if there are no child contexts and no Raphael objects created in this context
    if (layerNodes.length === 0 && childNodes.length === 0) {
      groupNode = this.generateGroupNode(raphaelCanvas);
      SC.$(raphaelCanvas.paper).append(SC.$(groupNode));
      layerNodes.push(groupNode);
    }
    
    // if this view itself has just one node, that's the layer node
    if (layerNodes.length === 1 && childNodes.length === 0) {
      layerNode = layerNodes[0];
    }
    else if(!this.isTopLevel) {
      // If we have multiple nodes, wrap them in a group node, because we must assign a single node to be the view's
      // layer.
      // Skip this step if we're in the top-level context (i.e., the one corresponding to the RaphaelCanvasView)
      // because the RaphaelCanvasView's layer already exists, and is a <div> containing the <svg> node (or VML nodes)
      layerNode = this.wrap( layerNodes.concat(childNodes), raphaelCanvas);
    }

    if (layerNode) {
      // When Raphael draws a shape, it stashes a reference to the raphael object in the DOM node for the shape.
      // If we've wrapped the shape, just stash it at the top level node we've created (note also that Raphael creates
      // a wrapper <group> node in VML mode but doesn't stash the reference there-another reason to stash it ourselves)
      if (!layerNode.raphael) {
        layerNode.raphael = raphaelObj;     
      }
      this.update(layerNode);
    }

    return layerNode;
  },
  
  
  update: function (node) {
    if (node === undefined) node = this._node;
    
    node.id = this._id;
    node.style.display = this._isVisible ? "" : "none";
  },
  
  
  raphael: function () {
    return this._node && this._node.raphael;
  },
  
  
  generateGroupNode: function (raphaelCanvas) {
    return raphaelCanvas.constructor.vml ?
      document.createElement("group") :
      document.createElementNS("http://www.w3.org/2000/svg", "g");
  },
  
  /**
    Wraps the list of nodes 'nodes' with a new grouping element (<g> in SVG, <group> in VML). Appends the new grouping
    element, now containing the passed nodes, into the raphael canvas immediately before the previous location of 
    node[0]
  
    TODO
    @param (nodes) the list of
    @param (raphaelCanvas) the raphael Canvas manager object ('paper')
    @returns
  */
  wrap: function (nodes, raphaelCanvas) {
    // see http://smartgraph-demos.dev.concord.org/test-raphael-group.html

    var wrapper = this.generateGroupNode(raphaelCanvas);
    var $wrapper = SC.$(wrapper);

    // we know nodes.length > 0 or we wouldn't have been called.
    $wrapper.insertBefore(SC.$(nodes[0]));

    for (var i=0, ii=nodes.length; i < ii; i++) {
      $wrapper.append(nodes[i]);
    }
    return $wrapper[0];
  },

  /**
    Converts a Raphael 'manager' object raphaelObj that may represent a Raphael set 
    (http://raphaeljs.com/reference.html#set) into a simple array of Raphael manager objects that represent the 
    underlying shapes. (Nested Raphael sets are flattened, rather than converted into nested arrays.)
  
    TODO:
    @param (raphaelObj) a Raphael manager object that represents either a Raphael set or a simple shape
    @returns (array of raphaelObjs) 'flattened' list of Raphael manager objects that represent simple shapes
  */
  flattenRaphaelSets: function (raphaelObj) { 
    var objs = [];
    if (raphaelObj.type === 'set') {
      for (var i = 0, ii = raphaelObj.items.length; i < ii; i++) {
        objs = objs.concat(this.flattenRaphaelSets(raphaelObj.items[i]));
      }
      return objs;
    }
    else {
      return [raphaelObj];
    }
  },

  /**
    Returns the outermost DOM node created for a given shape by Raphael, given the Raphael object raphaelObj that
    manages the shape. Raphael endows raphaelObj with a 'node' property that references the shape node, but in VML mode
    Raphael also wraps that shape node with a outer 'group' element, referenced by the Group property of raphaelObj. In
    VML mode, this returns the outer group element. In SVG mode, the 'node' is the outermost element, and is what is
    returned.

    TODO: 
    @param ...?
    @returns ...?
  */
  nodeForRaphaelObject: function (raphaelObj) {
    var isVML = raphaelObj.paper.constructor.vml;
    
    if (!(isVML || raphaelObj.paper.constructor.svg)) {
      throw "RaphaelContext can't figure out from raphaelObj whether mode is SVG or VML";
    }
    
    return isVML ? raphaelObj.Group : raphaelObj.node;
  }
});
