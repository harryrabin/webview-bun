import { CString, dlopen, FFIType, ptr } from "bun:ffi";

const lib = dlopen("./libs/webview-bun/zig-out/lib/libwebview-bun.dylib", {
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
    run: {
        returns: "void",
        args: ["ptr"]
    },
    destroy: {
        returns: "void",
        args: ["ptr"]
    }
});

export enum WVSizeHint {
    None = 0,
    Min = 1,
    Max = 2,
    Fixed = 3,
}

export class WebView {
    private readonly pointer: FFIType.pointer;

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

    run(): void {
        lib.symbols.run(this.pointer);
    }

    destroy(): void {
        lib.symbols.destroy(this.pointer);
    }
}