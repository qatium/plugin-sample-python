from pyodide import ffi
from typing import Protocol

class Asset(Protocol):
  @property
  def id(self) -> str:
    pass

class Network:
  def __init__(self, sdk):
    self.sdk = sdk
  def get_asset(self, assetId: str) -> Asset:
    return self.sdk["network"]["getAsset"](ffi.to_js(assetId))

class SDK:
  def __init__(self):
    self.sdk = globals()["sdk"]

  @property
  def network(self) -> Network:
    return Network(self.sdk)