# ===========================================================================
# Project:   RaphaelViews
# Copyright: ©2010 Richard Klancer and Concord Consortium.
# ===========================================================================

config :all, :required => [:sproutcore]
config :raphael_views, :required => [:raphael]

# config for demo apps
config :raphael_demo, 
  :required => :raphael_views, 
  :load_fixtures => true,
  :theme => 'sproutcore/ace'

# require :g_raphael if you want most gRaphaël functionality (bar/dot/pie/line)
config :g_raphael, :required => [:g_raphael_base]
config :g_raphael_base, :required => [:raphael]
