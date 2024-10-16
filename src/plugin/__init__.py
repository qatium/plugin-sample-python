from .plugin import MyPlugin
from qatiumsdk import register_plugin

register_plugin(MyPlugin())