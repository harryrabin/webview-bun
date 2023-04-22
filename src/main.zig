const std = @import("std");
const wv = @import("webview");

pub export fn create(devtools: bool) wv.webview_t {
    return wv.webview_create(if (devtools) 1 else 0, null);
}

pub export fn setTitle(w: wv.webview_t, title: [*c]const u8) void {
    return wv.webview_set_title(w, title);
}

pub export fn setSize(w: wv.webview_t, width: c_int, height: c_int, hints: c_int) void {
    return wv.webview_set_size(w, width, height, hints);
}

pub export fn setHtml(w: wv.webview_t, html: [*c]const u8) void {
    return wv.webview_set_html(w, html);
}

pub export fn run(w: wv.webview_t) void {
    return wv.webview_run(w);
}

pub export fn destroy(w: wv.webview_t) void {
    return wv.webview_destroy(w);
}
