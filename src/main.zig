const std = @import("std");
const wv = @import("webview");

pub export fn create(devtools: bool, NSWindowHandle: ?*anyopaque) wv.webview_t {
    return wv.webview_create(if (devtools) 1 else 0, NSWindowHandle);
}

pub export fn setTitle(w: wv.webview_t, title: [*c]const u8) void {
    wv.webview_set_title(w, title);
}

pub export fn setSize(w: wv.webview_t, width: c_int, height: c_int, hints: c_int) void {
    wv.webview_set_size(w, width, height, hints);
}

pub export fn setHtml(w: wv.webview_t, html: [*c]const u8) void {
    wv.webview_set_html(w, html);
}

pub export fn eval(w: wv.webview_t, js: [*c]const u8) void {
    wv.webview_eval(w, js);
}

pub export fn init(w: wv.webview_t, js: [*c]const u8) void {
    wv.webview_init(w, js);
}

pub export fn getWindow(w: wv.webview_t) ?*anyopaque {
    return wv.webview_get_window(w);
}

pub export fn returnValue(w: wv.webview_t, seq: [*c]const u8, value: [*c]const u8) void {
    wv.webview_return(w, seq, 0, value);
}

const MessageHandler: type = *fn ([*c]const u8, [*c]const u8) void;

pub export fn start(w: wv.webview_t, messageHandler: MessageHandler) void {
    wv.webview_bind(w, "wvSendMessage", sendMessageToBun, @ptrCast(?*anyopaque, messageHandler));
    wv.webview_init(w, @embedFile("./init.js"));

    wv.webview_run(w);
    defer wv.webview_destroy(w);
}

fn sendMessageToBun(seq: [*c]const u8, req: [*c]const u8, arg: ?*anyopaque) callconv(.C) void {
    const handler: MessageHandler = @ptrCast(MessageHandler, @alignCast(4, arg));
    handler(seq, req);
}
