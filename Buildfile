# ===========================================================================
# Project:   RaphaelViews
# Copyright: ©2010 Richard Klancer and Concord Consortium.
# ===========================================================================

config :all, :required => [:sproutcore]
config :raphael_views, :required => [:raphael]

config :raphael_demo, :required => :raphael_views, :load_fixtures => true

# require 'g.raphael.plugins' if you want most g.raphael functionality

config 'g.raphael.plugins', :required => ['g.raphael']
config 'g.raphael', :required => [:raphael]
