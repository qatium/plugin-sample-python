from typing import Dict

from .sdk import Plugin
from .sdk import SDK
from .sdk import ValveFamilies, AssetStatus

class MyPlugin(Plugin):
  def run(self):
    closed_valves = SDK.network.getValves(lambda *args: args[0].family == ValveFamilies.TCV and args[0].simulation and args[0].simulation.status == AssetStatus.CLOSED)

    SDK.ui.sendMessage(closed_valves.length)

  def close_valves(self, quantity: int):
      open_valves = SDK.network.getValves(
          lambda *args: args[0].simulation and args[0].simulation.status == AssetStatus.OPEN
      )

      for valve in open_valves[:quantity]:
          SDK.network.setStatus(valve.id, AssetStatus.CLOSED)

  def onMessage(self, message: Dict[str, str]):
      if message.command == 'closeValves':
          self.close_valves(message.data)