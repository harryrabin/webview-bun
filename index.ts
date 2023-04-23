import { dlopen, FFIType, JSCallback, ptr, suffix, CString } from "bun:ffi";

const lib = dlopen(`./libs/webview-bun/zig-out/lib/libwebview-bun.${suffix}`, {
    create: {
        returns: "ptr",
        args: ["bool", "ptr"]
    },
    setTitle: {
        returns: "void",
        args: ["ptr", "ptr"]
    },
    setSize: {
        returns: "void",
        args: ["ptr", "i32", "i32", "i32"]
    },
    setHtml: {
        returns: "void",
        args: ["ptr", "ptr"]
    },
    eval: {
        returns: "void",
        args: ["ptr", "ptr"]
    },
    init: {
        returns: "void",
        args: ["ptr", "ptr"]
    },
    start: {
        returns: "void",
        args: ["ptr", "callback"]
    },
    getWindow: {
        returns: "ptr",
        args: []
    },
    returnValue: {
        returns: "void",
        args: ["ptr", "ptr", "ptr"]
    }
});

export enum WVSizeHint {
    None = 0,
    Min = 1,
    Max = 2,
    Fixed = 3,
}

export class WebView {
    // Some confusing naming internally, but externally very concise. Notes provided for clarity.

    private readonly pointer: FFIType.pointer; // The pointer to the WebView instance.

    // The object containing message handlers. The key is the name of the message, and the value is the handler.
    private readonly messageHandlers: Record<string, (...args: any[]) => string | void> = {};

    // Function called by Zig when a message is sent from the WebView.
    private readonly messageCallback = new JSCallback((seq: FFIType.cstring, req: FFIType.cstring): void => {
        const args = JSON.parse((new CString(req) as unknown) as string);
        if (this.messageHandlers[args[0]] === undefined) return;

        const remainder = args.length > 1 ? args.slice(1) : [];

        const result = this.messageHandlers[args[0]](...remainder);

        if (typeof result === "string") {
            this.returnValue(seq, result);
        } else {
            this.returnValue(seq, "[null]");
        }
    }, {
        returns: "void",
        args: ["cstring", "cstring"]
    })

    constructor(debug: boolean = false, NSWindowHandle?: FFIType.pointer) {
        this.pointer = lib.symbols.create(debug, NSWindowHandle!);
    }

    setTitle(title: string): void {
        lib.symbols.setTitle(this.pointer, ptr(Buffer.from(title, "utf8")));
    }

    setSize(width: number, height: number, hint: WVSizeHint = 0): void {
        lib.symbols.setSize(this.pointer, width, height, hint);
    }

    setHtml(html: string): void {
        lib.symbols.setHtml(this.pointer, ptr(Buffer.from(html, "utf8")));
    }

    eval(js: string): void {
        lib.symbols.eval(this.pointer, ptr(Buffer.from(js, "utf8")));
    }

    init(js: string): void {
        lib.symbols.init(this.pointer, ptr(Buffer.from(js, "utf8")));
    }

    start(): void {
        lib.symbols.start(this.pointer, (this.messageCallback as unknown) as FFIType.pointer);
    }

    getWindow(): FFIType.pointer {
        return lib.symbols.getWindow();
    }

    returnValue(seq: FFIType.cstring, value: string): void {
        lib.symbols.returnValue(this.pointer, seq, ptr(Buffer.from(value, "utf8")));
    }

    sendMessage(name: string, ...args: any[]): void {
        this.eval(`window.__wvInvoke("${name}", "${JSON.stringify(args)}")`);
    }

    handleMessage(name: string, handler: (...args: any[]) => string | void): void {
        this.messageHandlers[name] = handler;
    }
}
