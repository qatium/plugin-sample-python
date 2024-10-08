from .sdk import Plugin
from .sdk import register_plugin
from .sdk import SDK

class MyPlugin(Plugin):
  def run(self):
    print(SDK().network.get_asset("P1").id)
    print("Hello world!")
