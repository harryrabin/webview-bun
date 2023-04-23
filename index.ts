import { dlopen, FFIType, JSCallback, ptr, suffix, CString } from "bun:ffi";

const lib = dlopen(`./libs/webview-bun/zig-out/lib/libwebview-bun.${suffix}`, {
    create: {
        returns: "ptr",
        args: ["bool"]
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
    start: {
        returns: "void",
        args: ["ptr", "callback"]
    },
});

export enum WVSizeHint {
    None = 0,
    Min = 1,
    Max = 2,
    Fixed = 3,
}

export class WebView {
    private readonly pointer: FFIType.pointer;
    public readonly messageHandlers: Record<string, (args: any[]) => void> = {};

    private readonly messageHandler = new JSCallback((json: FFIType.cstring): void => {
        const args = JSON.parse((new CString(json) as unknown) as string);
        if (this.messageHandlers[args[0]] === undefined) return;

        const remainder = args.length > 1 ? args.slice(1) : [];

        this.messageHandlers[args[0]](remainder);
    }, {
        returns: "void",
        args: ["cstring"]
    })

    constructor(debug: boolean = false) {
        this.pointer = lib.symbols.create(debug);
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

    start(): void {
        lib.symbols.start(this.pointer, (this.messageHandler as unknown) as FFIType.pointer);
    }
}
