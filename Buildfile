# ===========================================================================
# Project:   RaphaelViews
# Copyright: ©2010 Richard Klancer and Concord Consortium.
# ===========================================================================

# Add initial buildfile information here
config :all, 
  :required => [:sproutcore]

config :raphael_views,
  :required => [:raphael, 'g.raphael', 'g.raphael.plugins'] 
config 'g.raphael.plugins', :required => ['g.raphael']
config 'g.raphael', :required => [:raphael]  

config :raphael_demo, :required => :raphael_views

