from typing import Dict

from qatiumsdk import Plugin, sdk, ValveFamilies, AssetStatus

class MyPlugin(Plugin):
  def run(self):
    closed_valves = sdk.network.get_valves(lambda *args: args[0].family == ValveFamilies.TCV and args[0].simulation and args[0].simulation.status == AssetStatus.CLOSED)

    sdk.ui.send_message(closed_valves.length)

  def close_valves(self, quantity: int):
      open_valves = sdk.network.get_valves(
          lambda *args: args[0].simulation and args[0].simulation.status == AssetStatus.OPEN
      )

      for valve in open_valves[:quantity]:
          sdk.network.set_status(valve.id, AssetStatus.CLOSED)

  def onMessage(self, message: Dict[str, str]):
      if message.command == 'closeValves':
          self.close_valves(message.data)