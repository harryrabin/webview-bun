# webview-bun

`bun:ffi` bindings for [webview](https://github.com/webview/webview), plus some utilites for sending messages between Bun and the view's JavaScript engine.

webview is a very simple library, it doesn’t have deep integration with the window systems it relies on. On its own, it's perfect for making lightweight web-based GUIs for web servers and such, but not (yet) suitable for creating a full application. However, you can easily get a native window handle from webview and use it with other libraries. The `WebView.prototpye.getWindow()` function will return the handle as `FFIType.pointer` (equivalent to `void*` in C or `?*anyopaque` in Zig).

Currently this will only build on macOS, but webview works with Gtk on Linux and Edge on Windows, so some simple fixes in the build script should make it work on those platforms as well.

Documentation coming soon.