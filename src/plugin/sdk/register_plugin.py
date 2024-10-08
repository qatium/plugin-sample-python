from pyodide import ffi
from .sdk_version import sdk_version

def register_plugin(plugin):
  js_plugin = ffi.to_js(plugin)
  js_version = ffi.to_js(sdk_version)
  globals()["_registerPlugin"](js_plugin, js_version)